const transaction = require('../models/transaction');

class transactionRepository{
    async createTransaction(transactionData){
        return await transaction.create(transactionData);
    }
}

module.exports = new transactionRepository();