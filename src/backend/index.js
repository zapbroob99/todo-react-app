import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt'; // For password hashing

const app = express();
const port = 3500; // Use environment variable or default port

// Configure middleware
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend origin
    credentials: true // Allow credentials
}));

app.use(bodyParser.json());

// Simulated user data (replace with database connection)
const users = [
    {
        id: 1,
        username: 'admin',
        password: '$2a$12$91/KNJwE8k3gHzXbAJxax./fiRlI3GGa0koWB9iN7So.smqZLwpOu', // Hashed password (replace with actual hash)
        roles: ['admin'],
    },
    // Add more users with different roles
];

// Login endpoint
app.post('/auth', async (req, res) => {
    const { user, pwd } = req.body;

    if (!user || !pwd) {
        return res.status(400).json({ message: 'Missing Username or Password' });
    }

    try {
        // Find user by username
        const foundUser = users.find((u) => u.username === user);

        if (!foundUser) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Compare password hashes
        const match = await bcrypt.compare(pwd, foundUser.password);

        if (!match) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Generate a dummy access token (replace with JWT or similar)
        const accessToken = 'your_access_token';
        const roles = foundUser.roles;

        res.status(200).json({ accessToken, roles });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
