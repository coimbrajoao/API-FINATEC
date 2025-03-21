const TransactionService = require('../services/transactionService');
const transactionService = new TransactionService();


exports.post = async (req, res) => {
    const { value, description, type, category } = req.body;
    const { id } = req.user;
    console.log(req.body);
    try{
        const transaction = await transactionService.createTransaction({value, description, type, category, user_id: id});
        return res.status(201).json({ message: "Transaction created successfully", transaction  });
    }
    catch(err){
        console.log(err);
        if(err === 'The type must be credit or debit'){
            return res.status(400).json({ error: err });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}