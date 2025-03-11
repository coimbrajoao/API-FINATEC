const express = require('express');
const UserController = require('../controllers/UserController');
const authmiddleware = require('../middleware/authenticationMiddleware');
const adminValidator = require('../middleware/adminMiddleware');

const router = express.Router();
router.use(authmiddleware.authenticate());

router.post('/',adminValidator.admin(),UserController.post);
router.put('/:id',UserController.put);
router.get('/:id',UserController.getById);
router.get('/',adminValidator.admin(),UserController.getAll);
router.delete('/:id',adminValidator.admin(),UserController.delete);

module.exports = router;