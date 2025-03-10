const request = require('supertest');
const app = require('../../app');
const connection = require('../../database/index');
const {cpf} = require('cpf-cnpj-validator');

describe('Signup', () => {

    it('should create a new user registered successfully', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({
                name: 'Test',
                email: 'OQd8o@example.com',
                password: 'password',
                confirmedPassword: 'password',
                admin: true,
                cpf: cpf.generate() // Gera um CPF aleatório
            });
        
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User created successfully');
    });

    it('should not create a new user with the same email', async () => {
        const response = await request(app)
            .post('/auth/signup')
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

    it('should login successfully', async () => {
        const response = await request(app)
            .post('/auth/')
            .send({
                email: 'OQd8o@example.com',
                password: 'password'
            });
        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login successful');

    });

});

afterAll(async () => {
    // Feche a conexão com o banco de dados ou outras operações assíncronas
    await connection.close();
  });