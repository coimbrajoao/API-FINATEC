require('dotenv').config();
const AuthService = require('../services/authService');
const authService = new AuthService();

exports.post = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    try {
        const login = await authService.login(email, password);
        console.log(login);
        return res.status(200).json({ message: "Login successful", login });
    } catch (err) {
        if (err.message === "User not found") {
            return res.status(404).json({ error: "User not found" });
        }
        if (err.message === "Invalid password") {
            return res.status(400).json({ error: "Invalid password" });
        }
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.validateToken = async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ error: "Token not provided" });
    }
    try {
        const payload = await authService.validateToken(token);
        return res.status(200).json({ message: "Token is valid", payload });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}