const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

// Validation rules
const signupValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

const signinValidation = [
    body('identifier').trim().notEmpty().withMessage('Email or phone is required'),
    body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/signup', signupValidation, authController.signup);
router.post('/signin', signinValidation, authController.signin);

module.exports = router;
