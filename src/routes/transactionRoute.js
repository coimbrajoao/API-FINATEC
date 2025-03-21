const express = require('express');
const TransactionController = require('../controllers/transactionController');
const authmiddleware = require('../middleware/authenticationMiddleware');

const router = express.Router();
router.use(authmiddleware.authenticate());

router.post('/',TransactionController.post);

module.exports = router;