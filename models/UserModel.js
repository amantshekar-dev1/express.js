const db = require('../config/db');

/**
 * UserModel handles database operations for users.
 * Simple and direct methods for finding and creating users.
 */
class UserModel {
    // Find a user by their email address
    static findByEmail(email) {
        return db('users').where({ email }).first();
    }

    // Find a user by their phone number
    static findByPhone(phone) {
        return db('users').where({ phone }).first();
    }

    // Find a user by ID and return specific safe fields
    static findById(id) {
        return db('users')
            .where({ id })
            .first(['id', 'name', 'email', 'phone', 'created_at']);
    }

    // Register a new user and return the basic profile
    static create(userData) {
        return db('users')
            .insert(userData)
            .returning(['id', 'name', 'email', 'phone', 'created_at']);
    }
}

module.exports = UserModel;
