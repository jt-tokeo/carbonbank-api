const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    userId: { type: String },
    address: { type: String },
    country: { type: String },
    city:{ type: String },
    zipCode: { type: String },
    name: { type: String },
    description: { type: String },
    estimatedFundVolume: { type: String },
    expectedRevenue: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    depositDate: { type : Date },
    acceptationDate: { type : Date },
    published: { type: Boolean },
    price: { type: Number }
},{
    versionKey: false
});

const Project = mongoose.model('Project', projectSchema);

module.exports = {
    Project
}