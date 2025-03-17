const request = require('supertest');
const app = require('../../app');
const connection = require('../../database/index');
const { cpf } = require('cpf-cnpj-validator');

let adminToken; 
let userToken;  
jest.setTimeout(20000); 

beforeAll(async () => {
    try {
         console.log('Banco de dados sincronizado com sucesso!');

        // Cria um usuário admin manualmente (ou use um seed)
        const adminUser = await request(app)
            .post('/auth/signup')
            .send({
                name: 'Admin',
                email: 'admin@example.com',
                password: 'adminpassword',
                confirmedPassword: 'adminpassword',
                admin: true, 
                cpf: cpf.generate()
            });
        expect(adminUser.status).toBe(201);

        
        const adminLoginResponse = await request(app)
            .post('/auth/')
            .send({
                email: 'admin@example.com',
                password: 'adminpassword'
            });
        expect(adminLoginResponse.status).toBe(200);
        expect(adminLoginResponse.body).toHaveProperty('token');
        adminToken = adminLoginResponse.body.token;

        
        const userResponse = await request(app)
            .post('/auth/signup')
            .send({
                name: 'User',
                email: 'user@example.com',
                password: 'userpassword',
                confirmedPassword: 'userpassword',
                admin: false, // Não é admin
                cpf: cpf.generate()
            });
        expect(userResponse.status).toBe(201);

        
        const userLoginResponse = await request(app)
            .post('/auth/')
            .send({
                email: 'user@example.com',
                password: 'userpassword'
            });
        expect(userLoginResponse.status).toBe(200);
        expect(userLoginResponse.body).toHaveProperty('token');
        userToken = userLoginResponse.body.token;

    } catch (error) {
        console.error('Erro no beforeAll:', error);
    }
});

describe('Category', () => {
    it('should create a new category (admin only)', async () => {
        const response = await request(app)
            .post('/category/')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Test Category',
                description: 'This is a test category'
            });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Category created successfully');
    });

    it('should return all categories', async () => {
        const response = await request(app)
            .get('/category/')
            .set('Authorization', `Bearer ${userToken}`);
        expect(response.status).toBe(200);
    });

});

afterAll(async () => {
    try {
        await connection.close();
        console.log('Conexão com o banco de dados fechada com sucesso!');
    } catch (error) {
        console.error('Erro ao fechar a conexão com o banco de dados:', error);
    }
});