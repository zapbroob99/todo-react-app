import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt'; // For password hashing
import mysql2 from 'mysql2';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.BACKEND_PORT // Use environment variable or default port
const URL = process.env.ORIGIN_URL


// Configure middleware
app.use(cors({
    origin: URL,
    credentials: true // Allow credentials
}));

const db = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
})

db.connect((err)=>{
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

app.use(bodyParser.json());


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
        const accessToken = jwt.sign({ id: user.id, username: user.username }, '123', { expiresIn: '1h' });
        res.status(200).json({ accessToken });

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


app.listen(port, () => console.log(`Server listening on port ${port}`));
