const Item = require('../models/ItemModel');

// Fetches a paginated list of items with optional search/filtering
const getItems = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            name, 
            category, 
            sort = 'created_at', 
            order = 'desc' 
        } = req.query;

        // Basic pagination math
        const limitInt = parseInt(limit);
        const offset = (parseInt(page) - 1) * limitInt;

        // Fetch items from model
        const { items, total } = await Item.findAll({ 
            name, category, sort, order, limit: limitInt, offset 
        });

        res.json({
            items,
            pagination: {
                totalCount: total,
                currentPage: parseInt(page),
                limitValue: limitInt,
                totalPages: Math.ceil(total / limitInt)
            }
        });
    } catch (err) {
        console.error('Fetch Items Error:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getItems };
