const express = require('express');
const UserController = require('../../controllers/UserController');
const AuthController = require('../../controllers/AuthController');

const router = express.Router();

router.post('/', AuthController.post);
router.post('/validate', AuthController.validateToken);
router.post('/signup', UserController.post);

module.exports = router;