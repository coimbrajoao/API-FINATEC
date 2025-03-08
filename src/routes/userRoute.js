const express = require('express');
const UserController = require('../../controllers/UserController');
const authmiddleware = require('../../middleware/authenticationMiddleware');
const adminValidator = require('../../middleware/adminMiddleware');

const router = express.Router();
router.use(authmiddleware.authenticate());
router.use(adminValidator.admin());

router.post('/',UserController.post);
router.put('/:id',UserController.put);
router.get('/:id',UserController.getById);
router.get('/',UserController.getAll);
router.delete('/:id',UserController.delete);

module.exports = router;