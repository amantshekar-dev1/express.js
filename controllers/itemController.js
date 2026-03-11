const db = require('../config/db');

const getItems = async (req, res) => {
    try {
        const { page = 1, limit = 10, name, category, sort = 'created_at', order = 'desc' } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(limit);
        const limitInt = parseInt(limit);

        // Dynamic query building
        const query = db('items');

        // Partial search on name
        if (name) {
            query.where('name', 'ilike', `%${name}%`);
        }

        // Filter by category
        if (category) {
            query.where('category', category);
        }

        // Clone query for total count
        const totalCountQuery = query.clone().clearSelect().clearOrder().count('id as total').first();

        // Applying pagination and sorting
        const items = await query
            .orderBy(sort, order)
            .limit(limitInt)
            .offset(offset);

        const { total } = await totalCountQuery;

        res.json({
            items,
            pagination: {
                total: parseInt(total),
                page: parseInt(page),
                limit: limitInt,
                totalPages: Math.ceil(parseInt(total) / limitInt)
            }
        });
    } catch (error) {
        console.error('Get items error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getItems
};
