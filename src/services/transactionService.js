const repository = require('../repository/transactionRepository');
const CategoryService = require('./categoryService');
const categoryService = new CategoryService();
const {existsOrError, notExistsOrError, equalsOrError } = require('../validation/validation');


class transactionService{
        
    async createTransaction(transactionData){
        const {value, description, type, category, user_id} = transactionData;
        try{
             const fiels = {value, description, type, category, user_id};

            for(const field in fiels){
                existsOrError(fiels[field], `The field ${field} is required`);  
            }

            if(type !== 'credit' && type !== 'debit'){
                throw 'The type must be credit or debit';
            }
           
            if(transactionData.category){
                const category = await categoryService.getByName(transactionData.category);
                if(!category || category.length === 0){
                    throw 'Category not found';
                }
                transactionData.category_id = category.id;
                delete transactionData.category;
            }

            const transaction = await repository.createTransaction(transactionData);
            return transaction;
        }
        catch(err){
            throw err;
        }
    }

    

}

module.exports = transactionService;
