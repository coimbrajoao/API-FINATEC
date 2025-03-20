const request = require('supertest');
const app = require('../../app');
const connection = require('../../database/index');
const { cpf } = require('cpf-cnpj-validator');
const UserServices = require('../../services/userService');
const AuthService = require('../../services/authService');
require('dotenv').config();

let adminToken;
let category;
const userServices = new UserServices();
;

jest.setTimeout(20000); 

describe('Category', () => {
    beforeAll(async () => {
       const adminUser = await userServices.createUser({
            name: 'Admin',
            email: 'iJFw2@example.com',
            password: '123456',
            confirmedPassword: '123456',
            admin: true,
            cpf: cpf.generate()
        });

        adminToken = AuthService.generateToken(adminUser);
        console.log(adminToken);
    }); 

    it('should create a category', async () => {
        const response = await request(app)
            .post('/category')
            .set('authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Category Test',
                description: 'Category description'
            })

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Category created successfully');
        category = response.body.category.id;
    });

    it('should not create a category with the same name', async () => {
        const response = await request(app)
            .post('/category')
            .set('authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Category Test',
                description: 'Category description'
            })

        expect(response.status).toBe(409);
        expect(response.body.error).toBe('Category already exists');
    });
    
    it('should list all categories', async () => {
        const response = await request(app)
            .get('/category')
            .set('authorization', `Bearer ${adminToken}`)
            .query({page: 1,limit: 10 });

        expect(response.status).toBe(200);
        
    });

    it('should update a category', async () => {
        const response = await request(app)
            .put(`/category/${category}`)
            .set('authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Category Test Update',
                description: 'Category description update'
            })

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Category updated successfully');

    });
    
    it('should not update a category ', async () => {
        const response = await request(app)
            .put('/category/0')
            .set('authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Category Test Update',
                description: 'Category description update'
            })

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Category not found');
    });

    it('should get a category by id', async () => {
        const response = await request(app)
            .get(`/category/${category}`)
            .set('authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);

    });
    it('should delete a category', async () => {
        const response = await request(app)
            .delete(`/category/${category}`)
            .set('authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Category deleted successfully');
    });


    it('should not delete a category', async () => {
        const response = await request(app)
            .delete('/category/0')
            .set('authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Category not found');
    });

    afterAll(async () => {
        await connection.query('DELETE FROM users WHERE email = "iJFw2@example.com"');
        await connection.close();   
    })
});