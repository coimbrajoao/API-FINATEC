const encryptPassword = require('../services/encryptPassword');
const repository = require('../repository/userRepository');
const { existsOrError, validateEmail } = require('../validation/validation');
const { parse } = require('dotenv');
   
 exports.post= async (req, res) =>{

        const { name, email, password, confirmedPassword, admin, cpf } = req.body;

        
        try {
            
            const fields = { name, email, password, confirmedPassword,cpf };
            for (const field in fields) {
                existsOrError(fields[field], `The field ${field} is required`);
            }
            validateEmail(email);
            
        } catch (msg) {
            
            return res.status(400).json({ error: msg });
            
        }
        
        if (password !== confirmedPassword) {
            
            return res.status(400).json({ error: "The passwords do not match" });
        }
        const emailValid = await repository.GetUserByEmail(email);
        if(emailValid){
            return res.status(400).json({ error: "Email already exists" });
        }

        try {

            const user = await repository.GetUserByCpf(cpf);

            if (user) {

                return res.status(409).json({ error: "User with this CPF already exists" });
            }

            const hash = await encryptPassword(password);
        
            await repository.CreateUser({ name, email, password: hash, admin, cpf });
            return res.status(201).json({ message: "User created successfully" });
        
        } catch (err) {

            console.log(err);
            return res.status(500).json({ error: "Internal Server Error" });

        }

    }

exports.put =  async (req, res) =>{

        const { id } = req.params;  
        const {name, email, password, admin, cpf} = req.body; 

        try {

            existsOrError(id, "The field id is required");
            if (email) {
                validateEmail(email);
            }

            const user = await repository.GetUserById(id);

            if (!user) {

                return res.status(404).json({ error: "User not found" });
            }
            
            const updatedFields = {};

            if (name) updatedFields.name = name;
            if (email) updatedFields.email = email;
            if (password) updatedFields.password = await encryptPassword(password);
            if (admin) updatedFields.admin = admin;
            if (cpf) updatedFields.cpf = cpf;

            await repository.UpdateUser(id, updatedFields);


            return res.status(201).json({ message: "User updated successfully" });
        
        } catch (err) {

            console.log(err);
            return res.status(500).json({ error: "Internal Server Error" });

        }
 }

 exports.getById = async (req, res) =>{

    const { id } = req.params;

    try {

        existsOrError(id, "The field id is required");

        const user = await repository.GetUserById(id);

        if (!user) {

            return res.status(404).json({ error: "User not found" });
        }

        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            cpf: user.cpf,
            admin: user.admin
        }
        return res.status(200).json(userResponse);
        
    } catch (err) {

        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });

    }
 }


exports.getAll = async (req, res) =>{
    const { page = 1, limit = 10 } = req.query;

    const paserdLimit = parseInt(limit);

    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
        return res.status(400).json({ error: "Invalid page or limit parameters" });
    }

    const offset = (page - 1) * limit;

    const parsedoffset = parseInt(offset);

    if (isNaN(parsedoffset) || parsedoffset < 0) {
        return res.status(400).json({ error: "Invalid offset parameter" });
    }

    try {
        const {count, rows} = await repository.GetAllUsers({parsedoffset, paserdLimit});

        if (!rows || rows.length === 0) {

            return res.status(400).json({ error: "No users found" });
        }


        return res.status(200).send({ currentPage: parseInt(page), totalPage: Math.ceil(count / limit), users: rows });
        
    } catch (err) {

        console.log(err);
        return res.status(500).json({ error: "Internal Server Error", details: err });

    }
}

exports.delete = async (req, res) =>{

    const { id } = req.params;
    
    try {

        existsOrError(id, "The field id is required");

        const user = await repository.GetUserById(id);

        if (!user) {

            return res.status(404).json({ error: "User not found" });
        }

        const updatedFields = { deletedAt: new Date() };
        const [updatedUser] = await repository.UpdateUser(id, updatedFields);
        
        if (!updatedUser) {

            return res.status(404).json({ error: "Error deleting user" });
        }

        return res.status(200).json({ message: "User deleted successfully" });
        
    } catch (err) {

        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });

    }
}