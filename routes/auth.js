const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/config.json') 


// User registration
router.post('/register', async (req, res) => {
    try {
        const { name, phoneNumber, email, password } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'name is required' });
        }

        if (!phoneNumber) {
            return res.status(400).json({ error: 'phoneNumber is required' });
        }

        if (!password) {
            return res.status(400).json({ error: 'password is required' });
        }

        // Check if a user with the same phone number already exists
        const existingUser = await User.findOne({ where: { phoneNumber } });

        if (existingUser) {

            return res.status(400).json({ error: 'User with this phone number already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        await User.create({ name, phoneNumber, email, password: hashedPassword });

        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (error) {

        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Unable to register user' });
    }
});

// User login
router.post('/login', async (req, res) => {
    try {

        const { phoneNumber, password } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({ error: 'phoneNumber is required' });
        }

        if (!password) {
            return res.status(400).json({ error: 'password is required' });
        }

        // Find the user by phone number
        const user = await User.findOne({ where: { phoneNumber } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the password is correct
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, config.secret_key, { expiresIn: '1h' });

        res.json({ token, expires: "1h" });
    }
    catch (error) {

        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Unable to log in' });
    }
});

module.exports = router;
