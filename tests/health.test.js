const request = require('supertest');
const app = require('../index');

describe('Health Check API', () => {
    it('should return 200 OK and status message', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'OK');
        expect(res.body).toHaveProperty('message', 'Server is running');
    });
});
