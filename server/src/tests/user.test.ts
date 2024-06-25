import request from 'supertest';
import express from 'express';
import { sequelize } from '../config/database';
import userRoutes from '../routes/user';

const app = express();
app.use(express.json());
app.use('/api', userRoutes);

beforeAll(async () => {
await sequelize.sync({ force: true });
});

afterAll(async () => {
await sequelize.close();
});

describe('User API', () => {
    it('should create a new user', async () => {
        const res = await request(app)
        .post('/api/users')
        .send({
            userId: 'john.doe@example.com',
            password: 'password123',
            userName: 'John Doe',
            profileImg: 'http://example.com/profile.jpg',
            gitUrl: 'http://github.com/johndoe',
            introduce: 'Hello, I am John Doe!'
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
    });

    it('should fetch a user by ID', async () => {
        const userRes = await request(app)
        .post('/api/users')
        .send({
            userId: 'jane.doe@example.com',
            password: 'password456',
            userName: 'Jane Doe',
            profileImg: 'http://example.com/profile2.jpg',
            gitUrl: 'http://github.com/janedoe',
            introduce: 'Hello, I am Jane Doe!'
        });
        const userId = userRes.body.id;

        const res = await request(app).get(`/api/user/${userId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('userId', 'jane.doe@example.com');
    });
});