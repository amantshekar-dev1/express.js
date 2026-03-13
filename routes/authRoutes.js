const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const signupValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('phone').matches(/^\d{10}$/).withMessage('Phone number must be exactly 10 digits'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

const signinValidation = [
    body('identifier').trim().notEmpty().withMessage('Email or phone is required')
        .custom((value) => {
            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            const isPhone = /^\d{10}$/.test(value);
            if (!isEmail && !isPhone) {
                throw new Error('Please enter a valid email address or 10-digit phone number');
            }
            return true;
        }),
    body('password').notEmpty().withMessage('Password is required')
];

router.post('/signup', signupValidation, validate, authController.signup);
router.post('/signin', signinValidation, validate, authController.signin);
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
