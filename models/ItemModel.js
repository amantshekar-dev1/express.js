const db = require('../config/db');

/**
 * ItemModel handles data fetching for products/items.
 * Includes support for searching, filtering, and pagination.
 */
class ItemModel {
    static async findAll({ name, category, sort, order, limit, offset }) {
        const query = db('items');

        // Apply filters if they exist
        if (name) {
            query.where('name', 'ilike', `%${name}%`);
        }
        
        if (category) {
            query.where({ category });
        }

        // Get total count for pagination math
        const countRes = await query.clone().count('id as total').first();
        const total = parseInt(countRes.total);

        // Fetch results with sorting and paging
        const items = await query
            .orderBy(sort, order)
            .limit(limit)
            .offset(offset);

        return { items, total };
    }
}

module.exports = ItemModel;
