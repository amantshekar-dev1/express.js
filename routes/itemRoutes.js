const express = require('express');
const { query } = require('express-validator');
const itemController = require('../controllers/itemController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const getItemsValidation = [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('sort').optional().isIn(['id', 'name', 'category', 'price', 'stock', 'created_at']).withMessage('Invalid sort field'),
    query('order').optional().isIn(['asc', 'desc']).withMessage('Order must be asc or desc'),
    query('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
    query('name').optional().trim().notEmpty().withMessage('Search term cannot be empty')
];

// Protect this route with authMiddleware
router.get('/', authMiddleware, getItemsValidation, itemController.getItems);

module.exports = router;
