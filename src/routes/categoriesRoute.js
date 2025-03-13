const express = require('express');
const CategoriesController = require('../controllers/categoriesController');

const router = express.Router();
const authmiddleware = require('../middleware/authenticationMiddleware');
const adminValidator = require('../middleware/adminMiddleware');

router.use(authmiddleware.authenticate());

router.post('/', CategoriesController.post);
router.get('/', CategoriesController.get);
router.get('/:id', CategoriesController.getById);
router.put('/:id',adminValidator.admin(), CategoriesController.put);
router.delete('/:id',adminValidator.admin(), CategoriesController.delete);
module.exports = router;