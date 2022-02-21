const mongoose = require('mongoose');

const reportSchema = mongoose.Schema({
    date: { type: Date },
    creator: { type: String },
    dateStart: { type: Date },
    dateEnd:{ type: Date },
    file: { type: String },
},{
    versionKey: false
});

const Report = mongoose.model('Report', reportSchema);

module.exports = {
    Report
}