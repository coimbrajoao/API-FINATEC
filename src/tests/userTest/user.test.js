const request = require('supertest');
const app = require('../../app');
const connection = require('../../database/index');
const { cpf } = require('cpf-cnpj-validator');

let token;

beforeAll(async () => {
    await request(app)
        .post('/auth/signup')
        .send({
            name: 'Test',
            email: 'testelogin@example.com',
            password: 'password',
            confirmedPassword: 'password',
            admin: true,
            cpf: cpf.generate() // Gera um CPF aleatório
        });

    const loginresponse = await request(app)
        .post('/auth/')
        .send({
            email: 'testelogin@example.com',
            password: 'password'
        });
    token = loginresponse.body.token;
});

describe('User', () => {


    it('should crete a new user with admin false', async () => {
        const response = await request(app)
            .post('/users/')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Test',
                email: 'teste@example.com',
                password: 'password',
                confirmedPassword: 'password',
                admin: false,
                cpf: cpf.generate() // Gera um CPF aleatório
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User created successfully');
    });

    it('should not create a new user with the same email', async () => {
        const response = await request(app)
            .post('/users/')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Test',
                email: 'OQd8o@example.com',
                password: 'password',
                confirmedPassword: 'password',
                admin: false,
                cpf: cpf.generate() // Gera um CPF aleatório
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Email already exists');
    });

    it('should get all users', async () => {
        const response = await request(app)
            .get('/users/')
            .set('Authorization', `Bearer ${token}`)
            .query({ page: 1, limit: 10 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('currentPage');
        expect(response.body).toHaveProperty('totalPage');
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.users.length).toBeGreaterThan(0);

        response.body.users.forEach(user => {
            expect(user).toHaveProperty('id');
            expect(user).toHaveProperty('name');
            expect(user).toHaveProperty('email');
            expect(user).toHaveProperty('cpf');
            expect(user).toHaveProperty('admin');
        });
    });

    if('should not get all users without token', async () => {
        const response = await request(app)
            .get('/users/')
            .query({ page: 1, limit: 10 });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Token not provided');
    }); 

    it('should get user by id', async () => {
        const response = await request(app)
            .get('/users/1')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('email');
        expect(response.body).toHaveProperty('cpf');
        expect(response.body).toHaveProperty('admin');
    });

    it('should update user by id', async () => {
        const response = await request(app)
            .put('/users/1')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Test',
                email: 'OQd8o@examplekoko.com',
                password: 'password',
                confirmedPassword: 'password',
                admin: true
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User updated successfully');
    });
});