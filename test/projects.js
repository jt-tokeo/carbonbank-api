let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../src/api');
let settings = require('./__settings');
let expect = chai.expect;


chai.use(chaiHttp);

describe('Projects', () => {
    describe('/GET projects', () => {
        it('it should GET all the projects', (done) => {
            chai.request(server)
            .get('/projects')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('projects');
                expect(res.body.projects).to.be.a('array');
                done();
            });
        });
    });

});