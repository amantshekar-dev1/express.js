const request = require('supertest');
const app = require('../index');
const db = require('../config/db');

const uniqueID = Date.now();
const email = `human_${uniqueID}@test.com`;
const phone = String(uniqueID).slice(-10);
const pass = 'Password123!';

describe('Checking Auth Flow', () => {

    test('Phase 1: Signup', async () => {
        const res = await request(app).post('/api/auth/signup').send({
            name: 'Test Human',
            email,
            phone,
            password: pass
        });

        expect(res.status).toBe(201);
        expect(res.body.user.email).toBe(email);
    });

    test('Phase 2: Signin', async () => {
        const res = await request(app).post('/api/auth/signin').send({
            identifier: email,
            password: pass
        });

        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
    });

    test('Phase 3: Signin with wrong password', async () => {
        const res = await request(app).post('/api/auth/signin').send({
            identifier: email,
            password: 'wrong'
        });

        expect(res.status).toBe(401);
    });

    afterAll(async () => {
        await db('users').where({ email }).del();
        await db.destroy();
    });
});
