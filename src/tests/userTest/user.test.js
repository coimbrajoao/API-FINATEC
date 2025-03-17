const request = require('supertest');
const app = require('../../app');
const connection = require('../../database/index');
const { cpf } = require('cpf-cnpj-validator');
const { admin } = require('../../middleware/adminMiddleware');

let tokenUpdated;
let adminTokem;
jest.setTimeout(20000);


beforeAll(async () => {
    await connection.sync({ force: true });
    const response = await request(app)
        .post('/auth/signup')
        .send({
            name: 'Test',
            email: 'testelogin@example.com',
            password: 'password',
            confirmedPassword: 'password',
            admin: false,
            cpf: cpf.generate() // Gera um CPF aleatório
        });
    expect(response.status).toBe(201);

    const loginresponse = await request(app)
        .post('/auth/')
        .send({
            email: 'testelogin@example.com',
            password: 'password'
        });
    expect(loginresponse.status).toBe(200);
    expect(loginresponse.body).toHaveProperty('token');
    tokenUpdated = loginresponse.body.token;

    const updateResponse = await request(app)
        .put('/users/1')
        .set('Authorization', `Bearer ${tokenUpdated}`)
        .send({
            admin: true
        })
    expect(updateResponse.status).toBe(201);

    const userResponse = await request(app)
        .post('/auth/')
        .send({
            email: 'testelogin@example.com',
            password: 'password'
        });
    expect(userResponse.status).toBe(200);
    expect(userResponse.body).toHaveProperty('token');

    adminTokem = userResponse.body.token;

});



describe('User', () => {

    it('should update user by id', async () => {
        const response = await request(app)
            .put('/users/1')
            .set('Authorization', `Bearer ${adminTokem}`)
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

    it('should crete a new user with admin false', async () => {
        const response = await request(app)
            .post('/users/')
            .set('Authorization', `Bearer ${adminTokem}`)
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
            .set('Authorization', `Bearer ${adminTokem}`)
            .send({
                name: 'Test',
                email: 'teste@example.com',
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
            .set('Authorization', `Bearer ${adminTokem}`)
            .query({ page: 1, limit: 10 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('currentPage');
        expect(response.body).toHaveProperty('totalPage');
        expect(response.body).toHaveProperty('users');
        expect(Array.isArray(response.body.users)).toBe(true);
        expect(response.body.users.length).toBeGreaterThan(0);

        response.body.users.forEach(user => {
            expect(user).toHaveProperty('id');
            expect(user).toHaveProperty('name');
            expect(user).toHaveProperty('email');
            expect(user).toHaveProperty('cpf');
            expect(user).toHaveProperty('admin');
        });
    });

    it('should not get all users', async () => {
        const response = await request(app)
            .get('/users/')
            .set('Authorization', `Bearer ${adminTokem}`)
            .query({ page: 'abc', limit: 10 });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid page or limit parameters');
    });


    it('should get user by id', async () => {
        const response = await request(app)
            .get('/users/1')
            .set('Authorization', `Bearer ${adminTokem}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('email');
        expect(response.body).toHaveProperty('cpf');
        expect(response.body).toHaveProperty('admin');
    });

    it('should not get user by id', async () => {
        const response = await request(app)
            .get('/users/999')
            .set('Authorization', `Bearer ${adminTokem}`);

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('User not found');
    });

    it('should not delete user by id', async () => {
        const response = await request(app)
            .delete('/users/999')
            .set('Authorization', `Bearer ${adminTokem}`);

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('User not found');
    });

});

afterAll(async () => {
    await connection.close();
});