const { Transaction } = require("../schemas/transactions");

const getTransactions = async ()=>{
    let transactions = await Transaction.find();
    return {transactions};
};

module.exports = {
    getTransactions
}