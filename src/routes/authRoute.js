const express = require('express');
const UserController = require('../controllers/userController');
const AuthController = require('../controllers/authController');

const router = express.Router();

router.post('/', AuthController.post);
router.post('/validate', AuthController.validateToken);
router.post('/signup', UserController.post);

module.exports = router;