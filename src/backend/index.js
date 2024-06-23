// index.js

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import mysql2 from 'mysql2';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.BACKEND_PORT || 3500;
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

// Configure middleware
app.use(cors({
    origin: allowedOrigin,
    credentials: true // Allow credentials
}));
app.use(bodyParser.json());

const db = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE_NAME,
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// User authentication endpoint
app.post('/auth', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Missing Username or Password' });
    }

    try {
        // Query the database for the user
        const [rows, fields] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = rows[0];

        // Compare password hashes
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Generate JWT token
        const accessToken = jwt.sign({ id: user.id, username: user.username }, jwtSecret, { expiresIn: '1h' });
        res.status(200).json({ accessToken, id: user.id }); // Include user ID in the response

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Registration endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Missing Username or Password' });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        // Save user to database
        const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
        await db.promise().execute(sql, [username, hashedPassword]);

        res.status(200).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Registration failed:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Todo endpoints

// Get all todos for the authenticated user
app.get('/todo', authenticateToken, async (req, res) => {
    const userId = req.user.id; // Get the authenticated user's ID from the JWT token

    try {
        const [rows, fields] = await db.promise().query('SELECT * FROM todos WHERE user_id = ?', [userId]);
        res.status(200).json(rows);
    } catch (err) {
        console.error('Error retrieving todos:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Create a todo
app.post('/todo', authenticateToken, async (req, res) => {
    const { user_id, title, description, status } = req.body;
    try {
        const sql = 'INSERT INTO todos (user_id, title, description, status) VALUES (?, ?, ?, ?)';
        const [result] = await db.promise().execute(sql, [user_id, title, description, status]);
        const insertId = result.insertId;
        res.status(201).json({ insertId });
    } catch (err) {
        console.error('Error creating todo:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update a todo
app.put('/todo/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { user_id, title, description, status, created_at, completed_at } = req.body;
    try {
        const sql = 'UPDATE todos SET user_id = ?, title = ?, description = ?, status = ?, created_at = ?, completed_at = ? WHERE id = ?';
        await db.promise().execute(sql, [user_id, title, description, status, created_at, completed_at, id]);
        res.status(200).json({ message: 'Todo updated successfully' });
    } catch (err) {
        console.error('Error updating todo:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Delete a todo
app.delete('/todo/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const sql = 'DELETE FROM todos WHERE id = ?';
        await db.promise().execute(sql, [id]);
        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (err) {
        console.error('Error deleting todo:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
