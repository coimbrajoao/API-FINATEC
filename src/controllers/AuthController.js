const jwt = require('jwt-simple');
const bcrypt = require('bcrypt');
const repository = require('../repository/userRepository');
require('dotenv').config();

const generateToken = (user) => {
    const payload = { id: user.id, email: user.email, admin: user.admin, iat: Math.floor(Date.now() / 1000) - 30, exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) };
    return jwt.encode(payload, process.env.authSecret);
}
exports.post = async (req, res) => {
    try{

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        const user = await repository.GetUserByEmail(email);
        if (!user) {
            return res.status(400).json({ error: "User not found" });    
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid password" });
        }

        const token = generateToken(user);
        return res.status(200).json({ message: "Login successful", token });

    }catch(err){
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.validateToken = async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ error: "Token not provided" });
    }
    const payload = jwt.decode(token, process.env.SECRET);
    if (payload.exp <= Date.now()) {
        return res.status(400).json({ error: "Expired token" });
    }
    return res.status(200).json({ message: "Token is valid" });
}