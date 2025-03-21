const encryptPassword = require('../services/encryptPassword');
const repository = require('../repository/userRepository');
const { existsOrError, validateEmail } = require('../utils/validation/validation');


class UserService {

    async createUser(user) {

        const { name, email, password, confirmedPassword, admin, cpf } = user;

        try {

            const fields = { name, email, password, confirmedPassword, cpf };

            for (const field in fields) {
                existsOrError(fields[field], `The field ${field} is required`);
            }

            validateEmail(email);

        } catch (msg) {

            throw new Error(msg);

        }

        if (password !== confirmedPassword) {
            throw new Error("The password and confirmed password must be the same");
        }

        const emailValid = await repository.GetUserByEmail(email);
        if (emailValid) {
            throw new Error("Email already registered");
        }

        const encryptedPassword = await encryptPassword(password);

        return await repository.CreateUser({ name, email, password: encryptedPassword, admin, cpf });
    }

    async updateUser(id, user) {

        const { name, email, password, admin, cpf } = user;


        existsOrError(id, "The field id is required");
        if (email) {
            validateEmail(email);
        }

        const userGet = await repository.GetUserById(id);

        if (!userGet) {
            throw new Error("User not found");
        }

        const updatedFields = {};

        if (name) updatedFields.name = name;
        if (email) updatedFields.email = email;
        if (password) updatedFields.password = await encryptPassword(password);
        if (admin) updatedFields.admin = admin;
        if (cpf) updatedFields.cpf = cpf;

        return await repository.UpdateUser(id, updatedFields);

    }

    async getUserById(id) {

        existsOrError(id, "The field id is required");

        const user = await repository.GetUserById(id);

        if (!user) {
            throw new Error("User not found");
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            cpf: user.cpf,
            admin: user.admin
        }
    }

    async getAllUsers(page, limit) {       
        const { count, rows: users } = await repository.GetAllUsers(page, limit);
        const totalPage = Math.ceil(count / limit);

        return {
            users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalItems: count,
                totalPages: totalPage
            }
        };
            
    }

    async deleteUser(id) {

        existsOrError(id, "The field id is required");

        const user = await repository.GetUserById(id);

        if (!user) {
            throw new Error("User not found");
        }

        const updatedFields = { deletedAt: new Date() };
        const [updatedUser] = await repository.UpdateUser(id, updatedFields);

        if (!updatedUser) {
            throw new Error("Error deleting user"); 
        }

        return updatedUser;
    }
}

module.exports = UserService;