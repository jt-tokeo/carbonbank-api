const mongoose = require('mongoose');
let connectparams = require("./connectparams.json");
let connectstring = `mongodb://${connectparams.login}:${connectparams.password}@${connectparams.host}:${connectparams.port}/${connectparams.basename}?authSource=admin&readPreference=primary`;
mongoose.connect(
    connectstring,
    {useNewUrlParser: true, useUnifiedTopology: true}
);

 
let db = mongoose.connection; 
db.on('error', console.error.bind(console, 'Erreur connection à mongo')); 
db.once('open', function (){
    console.log("Connexion à la mongo OK"); });

