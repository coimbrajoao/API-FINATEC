const encryptPassword = require('../services/encryptPassword');
const repository = require('../repository/userRepository');
const { existsOrError, validateEmail } = require('../validation/validation');
const { parse } = require('dotenv');
const UserService = require('../services/userService');
const userService = new UserService();

exports.post = async (req, res) => {

    const user = req.body;
    try {
        await userService.createUser(user);
        return res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.log(err);
        if (err.message === "Email already registered") {
            return res.status(409).json({ error: "Email already registered" });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }

}

exports.put = async (req, res) => {
    const { id } = req.params;
    const { name, email, password, admin, cpf } = req.body;

    try {
        await userService.updateUser(id, { name, email, password, admin, cpf });
        return res.status(200).json({ message: "User updated successfully" });
    } catch (err) {
        console.log(err);
        if (err.message === "User not found") {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.getById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userService.getUserById(id);
        return res.status(200).json(user);
    } catch (err) {
        console.log(err);
        if (err.message === "User not found") {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


exports.getAll = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const result = await userService.getAllUsers(page, limit);
        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.delete = async (req, res) => {

    const { id } = req.params;
    try {
        await userService.deleteUser(id);
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        console.log(err);
        if(err.message === "User not found") {
            return res.status(404).json({ error: "User not found" });
        }
        
        return res.status(500).json({ error: "Error deleting user" });
    }
}