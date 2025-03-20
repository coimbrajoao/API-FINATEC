const request = require('supertest');
const app = require('../../app');
const connection = require('../../database/index');
const { cpf } = require('cpf-cnpj-validator');
const UserServices = require('../../services/userService');
const AuthService = require('../../services/authService');
const e = require('express');

require('dotenv').config();


let adminToken;
const userServices = new UserServices();


describe('User', () => {
    beforeAll(async () => {
        const adminUser = await userServices.createUser({
             name: 'Admin',
             email: 'oJFw2@example.com',
             password: '123456',
             confirmedPassword: '123456',
             admin: true,
             cpf: cpf.generate()
         });
 
         adminToken = AuthService.generateToken(adminUser);
         console.log(adminToken);
     });

    it('should create a user', async () => {
        const response = await request(app)
            .post('/users/')
            .set('authorization', `Bearer ${adminToken}`)
            .send({
                name: 'User Test',
                email: 'FtKlV@example.com',
                password: '123456',
                confirmedPassword: '123456',
                admin: false,
                cpf: cpf.generate()
            })
            console.log(response.body);
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User created successfully');

    });

    it('should not create a user with the same email', async () => {
        const response = await request(app)
            .post('/users/')
            .set('authorization', `Bearer ${adminToken}`)
            .send({
                name: 'User Test',
                email: 'FtKlV@example.com',
                password: '123456',
                confirmedPassword: '123456',
                admin: false,
                cpf: cpf.generate()
            })
        expect(response.status).toBe(409);
        expect(response.body.error).toBe('Email already registered');
    });

    it('should return a list of users', async () => {
        const response = await request(app)
            .get('/users/')
            .set('authorization', `Bearer ${adminToken}`)
            .query({page: 1, limit: 10});

        expect(response.status).toBe(200);
       
    });

    it('should return a user by id', async () => {
        const response = await request(app)
            .get('/users/2')
            .set('authorization', `Bearer ${adminToken}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(2);
    });

    it('should update a user', async () => {
        const response = await request(app)
            .put('/users/2')
            .set('authorization', `Bearer ${adminToken}`)
            .send({
                name: 'User Test Update'
            })
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User updated successfully');
    });
   
    it('should not update a user', async () => {
        const response = await request(app)
            .put('/users/0')
            .set('authorization', `Bearer ${adminToken}`)
            .send({
                name: 'User Test Update'
            })
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('User not found');
    });

    it('should not delete a user', async () => {
        const response = await request(app)
            .delete('/users/9999')
            .set('authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('User not found');
    });
    it('should delete a user', async () => {
        const response = await request(app)
            .delete('/users/2')
            .set('authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User deleted successfully');
    });


    afterAll(async () => {
        await connection.query('DELETE FROM users WHERE email in ( "FtKlV@example.com")');
        await connection.close();   
    })
});