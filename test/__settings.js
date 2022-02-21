const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mockdate = require('mockdate');
const jwt = require('jsonwebtoken');

const User = require('../src/schemas/users').User;
const Project = require('../src/schemas/projects').Project;

const secretword = require('../src/secret.json').secret;

mockdate.set('2021-12-27');
let date = new Date();

let userAdmin = {
    "email": "admin@email.com",
    "password": "password",
    "companyName": "H654",
    "firstName": "Jerome",
    "name": "Teisseire",
    "phone": "0707070707",
    "address": "",
    "city": "PAU",
    "country": "France",
    "role": "admin"
};
let userInvestor = {
    "email": "investor@email.com",
    "password": "password",
    "companyName": "Test Inc",
    "name": "Tartempion",
    "firstName": "Jean-Michel",
    "phone": "+33123456789",
    "address": "5 rue de Montreal",
    "city": "Pau",
    "country": "France",
    "role": "investor"
};
let userHolder = {
    "email": "holder@email.com",
    "role": "holder",
    "companyName": "Test Inc",
    "name": "Tartempion",
    "firstName": "Pierre",
    "phone": "+33123456789",
    "country": "France",
    "city": "Pau",
    "password": "password"
}

let project = {
    "address": "t",
    "country": "France",
    "city": "Pau",
    "zipCode": "64000",
    "name": "Projet G",
    "description": "description du projet G",
    "estimatedFundVolume": "0",
    "expectedRevenue": "0",
    "depositDate": date,
    "published": true,
    "latitude": 52.562214,
    "longitude": 21
}

let mongoServer;

let adminid;
let investorid;
let holderid;
let projectid;

let admintoken;
let investortoken;
let holdertoken;

before(async () => {
    mongoServer = await MongoMemoryServer.create({ binary: { version: '5.0.3' } });
    const mongoUri = mongoServer.getUri();
    mongoose.connect(mongoUri,{useNewUrlParser: true, useUnifiedTopology: true});

    let adm = new User(userAdmin);
    adminid = (await adm.save())._id;
    admintoken = jwt.sign({ "id":adminid , "logDate": new Date()},secretword);

    let invest = new User(userInvestor);
    investorid = (await invest.save())._id;
    investortoken = jwt.sign({ "id":investorid , "logDate": new Date()},secretword);

    let holder = new User(userHolder);
    holderid = (await holder.save())._id;
    holdertoken = jwt.sign({ "id":holderid , "logDate": new Date()},secretword);

    let proj = new Project(project);
    projectid = (await proj.save())._id;
});

after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

module.exports = {
    adminid,
    admintoken,
    investorid,
    investortoken,
    holderid,
    holdertoken,
    projectid
}
