const jwt = require('jwt-simple');
const bcrypt = require('bcrypt');
const repository = require('../repository/userRepository');
require('dotenv').config();


class authService {
    static generateToken = (user) => {
        const payload = { 
            id: user.id, 
            email: user.email, 
            admin: user.admin, 
            iat: Math.floor(Date.now() / 1000), 
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) 
        };
        return jwt.encode(payload, process.env.authSecret);
    }
    async login(email, password) {

        const user = await repository.GetUserByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid password");
        }
        const token = authService.generateToken(user);
        return token;

    }

    async validateToken(token) {
        const payload = jwt.decode(token, process.env.authSecret);
        if (payload.exp <= Date.now()) {
            throw new Error("Expired token");
        }
        return payload;
    }

}

module.exports = authService;