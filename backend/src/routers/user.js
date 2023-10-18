const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth'); // Import the auth middleware

const router = express.Router();

// Create a new user
router.post('/users', async (req, res) => {
    try {
        const newUser = new User(req.body);
        // Hash the password before saving it to the database
        newUser.password = await bcrypt.hash(newUser.password, 8); // Hash with a salt of 8 rounds
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login route
router.post('/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password);

        if (!user) {
            return res.status(401).json({ error: 'Invalid login credentials' });
        }

        const token = jwt.sign({ _id: user._id.toString() }, 'love-babbar'); // Replace with your own secret key

        // Set the token in the response headers
        res.header('Authorization', `Bearer ${token}`);
        res.status(200).json({ user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Read all users
// Fetch the details of the currently authenticated user
router.get('/users', auth, async (req, res) => {
    try {
        // You can access the authenticated user's details from req.user
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Read a user by ID
router.get('/users/:id', auth, async (req, res) => { // Protect this route with auth middleware
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a user by ID using PATCH
router.patch('/users/:id', auth, async (req, res) => { // Protect this route with auth middleware
    const userId = req.params.id;
    const updates = req.body;

    try {
        const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update a user's password by ID using PUT
router.put('/users/:id', auth, async (req, res) => { // Protect this route with auth middleware
    const userId = req.params.id;
    const newPassword = req.body.password;

    try {
        // Hash the new password before updating it
        const hashedPassword = await bcrypt.hash(newPassword, 8);
        const user = await User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a user by ID
router.delete('/users/:id', auth, async (req, res) => { // Protect this route with auth middleware
    const userId = req.params.id;

    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
