let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../src/api');
let settings = require('./__settings');
let expect = chai.expect;


chai.use(chaiHttp);

describe("Login",()=>{
    describe("Log admin",()=>{
        it('It should return token,role and id',(done)=>{
            chai.request(server)
            .post('/login')
            .send({
                email:'admin@email.com',
                password:'password'
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.token).to.be.a('string');
                expect(res.body.role).to.be.a('string');
                expect(res.body.role).to.be.equal('admin');
                expect(res.body.id).to.be.a('string');
                done();
            });
        });
    });
    describe("Log holder",()=>{
        it('It should return token,role and id',(done)=>{
            chai.request(server)
            .post('/login')
            .send({
                email:'holder@email.com',
                password:'password'
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.token).to.be.a('string');
                expect(res.body.role).to.be.a('string');
                expect(res.body.role).to.be.equal('holder');
                expect(res.body.id).to.be.a('string');
                done();
            });
        });
    });
    describe("Log investor",()=>{
        it('It should return token,role and id',(done)=>{
            chai.request(server)
            .post('/login')
            .send({
                email:'investor@email.com',
                password:'password'
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.token).to.be.a('string');
                expect(res.body.role).to.be.a('string');
                expect(res.body.role).to.be.equal('investor');
                expect(res.body.id).to.be.a('string');
                done();
            });
        });
    });
    describe("log with unexisting email",()=>{
        it('It should 403 and message',(done)=>{
            chai.request(server)
            .post('/login')
            .send({
                email:'unexisting@email.com',
                password:'password'
            })
            .end((err, res) => {
                expect(res).to.have.status(403);
                expect(res.body).to.be.a('object');
                expect(res.body.message).to.be.a('string');
                expect(res.body.message).to.be.equal('EmailDoesNotExist');
                expect(res.body.code).to.be.a('number');
                expect(res.body.code).to.be.equal(403);
                done();
            });
        });
    });
    describe("log with wrong password",()=>{
        it('It should 403 and message',(done)=>{
            chai.request(server)
            .post('/login')
            .send({
                email:'admin@email.com',
                password:'wrongpassword'
            })
            .end((err, res) => {
                expect(res).to.have.status(403);
                expect(res.body).to.be.a('object');
                expect(res.body.message).to.be.a('string');
                expect(res.body.message).to.be.equal('WrongPassord');
                expect(res.body.code).to.be.a('number');
                expect(res.body.code).to.be.equal(403);
                done();
            });
        });
    });
});