const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { validationResult } = require('express-validator');

const signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await db('users')
            .where('email', email)
            .orWhere('phone', phone)
            .first();

        if (existingUser) {
            return res.status(400).json({ message: 'User with this email or phone already exists' });
        }

        // Hash password
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        const [newUser] = await db('users')
            .insert({
                name,
                email,
                phone,
                password: hashedPassword
            })
            .returning(['id', 'name', 'email', 'phone', 'created_at']);

        res.status(201).json({
            message: 'User created successfully',
            user: newUser
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const signin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { identifier, password } = req.body; // identifier can be email or phone

    try {
        // Find user by email or phone
        const user = await db('users')
            .where('email', identifier)
            .orWhere('phone', identifier)
            .first();

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        res.json({
            message: 'Logged in successfully',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    signup,
    signin
};
