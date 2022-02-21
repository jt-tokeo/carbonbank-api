const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: { type: String },
    password: { type: String },
    role: {type:String}, // "investor" ou "holder" ou "admin"
    companyName :{ type : String},
    name: { type: String },
    firstName: { type: String },
    phone: { type: String },
    address: { type: String },
    country: { type: String },
    city:{type : String},
    zipCode: { type: String },
    TCBAddress : { type: String },
    TCBBalance : {type : Number},
    TCCBalance : {type : Number},
    TCBStack : {type: Number},
    transactions : [{
        typeToken :{type:String}, //"tcb" or "cc"
        action : {type:String}, // "buy", "sell", "stack" or "burn"
        amount : {type:Number},
        date : {type:Date}
    }],
    certificates : [{
            date : {type:Date},
            amount : {type:Number}
    }],
    underRole: {type: String},
    displayPublicPages: { type: Boolean },
    logo: { type: String },
    site: { type: String },
    prodEnabled: { type: Boolean },
    sustainabilityReport: { type: String },
    weightUnits: { type: String }
},{
    versionKey: false
});

const User = mongoose.model('User', userSchema);

module.exports = {
    User
}