const mongoose = require('mongoose');

const modifSchema = mongoose.Schema({
    modCollection : {type:String}, //users ou projects
    modId : {type:String}, // id du document à modifier
    askForDelete : {type:Boolean}, // si l'utilisateur demande de supprimer
    user : {
        email: { type: String },
        companyName :{ type : String},
        name: { type: String },
        firstName: { type: String },
        phone: { type: String },
        address: { type: String },
        country: { type: String },
        city:{type : String},
        zipCode: { type: String } 
    },
    project:{
        address: { type: String },
        country: { type: String },
        city:{ type: String },
        zipCode: { type: String },
        name: { type: String },
        description: { type: String },
        estimatedFundVolume: { type: String },
        expectedRevenue: { type: String }
    }
},{
    versionKey: false
});

const Modif = mongoose.model('Modif', modifSchema);

module.exports = {
    Modif
}