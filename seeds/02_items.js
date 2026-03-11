/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('items').del();

    const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Sports', 'Beauty', 'Toys', 'Automotive', 'Garden', 'Industrial'];
    const items = [];

    for (let i = 1; i <= 1000; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        items.push({
            name: `Product ${i} - ${category} specialized`,
            description: `Description for product ${i} in ${category} category. This is a high-quality item designed for production-ready systems.`,
            category: category,
            price: parseFloat((Math.random() * 500 + 10).toFixed(2)),
            stock: Math.floor(Math.random() * 200)
        });

        // Batch insertion to avoid memory issues and SQL limits
        if (items.length === 100) {
            await knex('items').insert(items);
            items.length = 0;
        }
    }

    // Insert any remaining items
    if (items.length > 0) {
        await knex('items').insert(items);
    }
};
