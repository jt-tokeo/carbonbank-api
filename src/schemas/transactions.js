const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
    date: { type: Date },
    status: { type: Boolean },
    cost: { type: Number },
    carbon: { type: Number },
    tags: { type: [String] },
    project: { type: String },
    notes: { type: String },
},{
    versionKey: false
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = {
    Transaction
}