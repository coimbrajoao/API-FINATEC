const jwt = require('jwt-simple');
const bcrypt = require('bcrypt');
const repository = require('../repository/userRepository');
require('dotenv').config();

exports.post = async (req, res) => {
    const { email, password } = req.body;
    const user = await repository.GetUserByEmail(email);
    if (!user) {
        return res.status(400).json({ error: "User not found" });    
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ error: "Invalid password" });
    }
    const payload = { id: user.id, email: user.email, admin: user.admin, iat: Math.floor(Date.now() / 1000) - 30 };
    const token = jwt.encode(payload, process.env.authSecret);
    return res.status(200).json({ message: "Login successful", token });
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