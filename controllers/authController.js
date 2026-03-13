const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

// Handles user registration
const signup = async (req, res) => {
    const { name, email, phone, password } = req.body;

    try {
        // Check if user already exists
        const exists = await User.findByEmail(email) || await User.findByPhone(phone);
        if (exists) {
            return res.status(400).json({ message: 'Email or phone already in use' });
        }

        // Securely hash the password
        const saltRounds = 12; // Standard depth
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Save to database
        const [newUser] = await User.create({
            name,
            email,
            phone,
            password: hashedPassword
        });

        res.status(201).json({ 
            message: 'User created successfully', 
            user: newUser 
        });
    } catch (err) {
        console.error('Signup Error:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Handles user login and token generation
const signin = async (req, res) => {
    const { identifier, password } = req.body;

    try {
        // Find user by email or phone
        const user = await User.findByEmail(identifier) || await User.findByPhone(identifier);
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create a secure JWT 
        const token = jwt.sign(
            { id: user.id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.json({ 
            message: 'Logged in successfully', 
            token, 
            user: { 
                id: user.id, 
                name: user.name, 
                email: user.email 
            } 
        });
    } catch (err) {
        console.error('Signin Error:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Returns the logged-in user's data
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    } catch (err) {
        console.error('Profile Error:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { signup, signin, getProfile };
