/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('items', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.text('description');
        table.string('category').notNullable();
        table.decimal('price', 10, 2);
        table.integer('stock').defaultTo(0);
        table.timestamps(true, true);

        // Index for search optimization
        table.index(['name'], 'idx_item_name');
        table.index(['category'], 'idx_item_category');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('items');
};
