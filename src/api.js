const express = require('express');
const cors = require('cors');

const app = express();

const auth = require('./auth/auth');
const apientries = require('./auth/apientries');

const users = require('./api/users');
const projects = require('./api/projects');
const modifs = require('./api/modifs');
const tokens = require('./api/tokens');
const transactions = require('./api/transactions');
const reports = require('./api/reports');
const stripe = require('./api/stripe');


app.use(express.static("public"));
app.use(express.json());
app.use(cors());


/**
 * @api {post} /login
 * @apiName login
 * @apiGroup login
 * @apiDescription User logs in
 * 
 * @apiParam {String} email
 * @apiParam {String} password
 * 
 * @apiParamExample {json} Request-Example:
 *      {
 *          "email": "john.doe@emailexample.ex",
 *          "password": "123456"
 *      }
 * 
 * @apiError WrongEmail the requested email does not exist
 * @apiErrorExample Error-Response:
 *      HTTP/1.1 403 Forbidden
 *      {
 *          "code":403,
 *          "message": "EmailDoesNotExist"
 *      }
 * 
 * @apiError WrongPassword the entered password is wrong
 * @apiErrorExample Error-Response:
 *      HTTP/1.1 403 Forbidden
 *      {
 *          "code":403,
 *          "message": "WrongPassord"
 *      }
 * 
 * @apiSuccess {String} role role of the user
 * @apiSuccess {String} token connection jwt token
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "role": "investor",
 *          "token": "tokenexample.notarealtoken.donotusethistoken" 
 *      }
 */
app.post('/login',(req,res)=>{
    apientries.classic(req,res,()=>auth.login(req.body));
});

/**
 * @api {post} /signup
 * @apiName InvestorSignUp
 * @apiGroup users
 * @apiDescription User Signs up as an investor
 * 
 * @apiParam {String} email email address
 * @apiParam {String} password password
 * @apiParam {String} companyName Name of Company
 * @apiParam {String} firstName first name
 * @apiParam {String} name family name
 * @apiParam {String} phone phone number
 * @apiParam {String} address address
 * @apiParam {String} city city
 * @apiParam {String} country country
 * @apiParam {String} zipCode zip code
 * 
 * @apiParamExample {json} Request-Example:
 *      {
 *          "email": "john.doe@emailexample.ex",
 *          "password": "123456",
 *          "companyName": "Example Inc",
 *          "firstName": "John",
 *          "name": "Doe",
 *          "phone": "+33655443322",
 *          "address": "3 rue du Labrador",
 *          "city" : "Pau",
 *          "country": "France",
 *          "zipCode":"64000",
 *          "projectName": "Project Zero",
 *          "description": "description of the project"
 * 
 * 
 *      }
 * 
 * @apiError UserAlreadyExists user with requested email already exists
 * @apiErrorExample Error-Response:
 *      HTTP/1.1 409 Conflict
 *      {
 *          "code":409
 *          "message": "UserAlreadyExists"
 *      }
 * 
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "message": "AccountCreated"
 *      }
 *
 */
app.post('/signup',(req,res)=>{
    apientries.classic(req,res,()=>users.InvestorSignUp(req.body));
});


/**
 * @api {post} /project/deposit
 * @apiName ProjectDeposit
 * @apiGroup projects
 * @apiDescription User submits a project
 * 
 * @apiParam {String} email email address
 * @apiParam {String} companyName Name of Company
 * @apiParam {String} firstName first name
 * @apiParam {String} name family name
 * @apiParam {String} phone phone number
 * @apiParam {String} address address
 * @apiParam {String} city city
 * @apiParam {String} country country
 * @apiParam {String} zipCode zip code
 * @apiparam {String} projectName name of the project
 * @apiParam {String} description description of the project
 * 
 * @apiParamExample {json} Request-Example:
 *      {
 *          "email": "john.doe@emailexample.ex"
 *          "companyName": "Example Inc",
 *          "firstName": "John",
 *          "name": "Doe",
 *          "phone": "+33655443322",
 *          "address": "3 rue du Labrador",
 *          "city" : "Pau",
 *          "country": "France",
 *          "zipCode":"64000"
 *      }
 * 
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "message": "ProjectSubmitted"
 *      }
 */
app.post('/project/deposit',(req,res)=>{
    apientries.classic(req,res,()=>projects.ProjectDeposit(req.body));
});

/**
 * @api {get} /users
 * @apiName getUsers
 * @apiGroup users
 * @apiDescription get all users information
 * 
 * 
 */
app.get('/admin/users',auth.authjwt,(req,res)=>{
    apientries.admin(req,res,()=>users.getUsers());
});

/**
 * @api {get} /user/:id
 * @apiName getUser
 * @apiGroup users
 * @apiDescription get information of a specific user
 * 
 * 
 */
app.get('/user/:id',auth.authjwt,(req,res)=>{
    apientries.user(req,res,()=>users.getUser(req.params.id));
});

/**
 * @api {get} /project/:id
 * @apiName getProject
 * @apiGroup projects
 * @apiDescription get information of a specific project
 * 
 * @apiParam id id of the project
 */
app.get('/project/:id',(req,res)=>{
    apientries.classic(req,res,()=>projects.getProject(req.params.id));
});

/**
 * @api {get} /projects
 * @apiName getProjects
 * @apiGroup projects
 * @apiDescription get all projects information
 * 
 * 
 */
app.get('/projects',(req,res)=>{
    apientries.classic(req,res,()=>projects.getProjects());
});

/**
 * @api {get} /projects/byuser/:id
 * @apiName getProjectsByUser
 * @apiGroup projects
 * @apiDescription get information of projects from a specific holder
 * 
 * @apiParam id id of holder
 */
app.get('/projects/byuser/:id',auth.authjwt,(req,res)=>{
    apientries.user(req,res,()=>projects.getProjectsByUser(req.params.id));
});

app.put('/user/:id',auth.authjwt,(req,res)=>{
    apientries.user(req,res,()=>users.requestModifyUser(req.params.id,req.body));
});

app.delete('/user/:id',auth.authjwt,(req,res)=>{
    apientries.user(req,res,()=>users.requestDeleteUser(req.params.id));
});

app.put('/project/:id',auth.authjwt,(req,res)=>{
    apientries.project(req,res,()=>projects.requestModifyProject(req.params.id,req.body));
});

app.delete('/project/:id',auth.authjwt,(req,res)=>{
    apientries.project(req,res,()=>projects.requestDeleteProject(req.params.id));
});

app.put('/user/password/:id',auth.authjwt,(req,res)=>{
    apientries.user(req,res,()=>users.modifyPassword(req.params.id,req.body));
});

app.get('/admin/modifs',auth.authjwt,(req,res)=>{
    apientries.admin(req,res,()=>modifs.getModifs());
});

app.put('/admin/modif/:id',auth.authjwt,(req,res)=>{
    apientries.admin(req,res,()=>modifs.modifyModif(req.params.id,req.body));
});

app.put('/admin/modif/validate/:id',auth.authjwt,(req,res)=>{
    apientries.admin(req,res,()=>modifs.validateModif(req.params.id));
});

app.delete('/admin/modif/:id',auth.authjwt,(req,res)=>{
    apientries.admin(req,res,()=>modifs.deleteModif(req.params.id));
});


app.get('/admin/projects',auth.authjwt,(req,res)=>{
    apientries.admin(req,res,()=>projects.getProjectsAdmin());
});

app.get('/admin/projects/unpublished',auth.authjwt,(req,res)=>{
    apientries.admin(req,res,()=>projects.getUnpublishedProjects());
});

app.get('/admin/project/:id',auth.authjwt,(req,res)=>{
    apientries.admin(req,res,()=>projects.getProjectAdmin(req.params.id));
});


app.put('/admin/user/:id',auth.authjwt,(req,res)=>{
    apientries.admin(req,res,()=>users.modifyUser(req.params.id,req.body));
});

app.delete('/admin/user/:id',auth.authjwt,(req,res)=>{
    apientries.admin(req,res,()=>users.deleteUser(req.params.id));
});

app.put('/admin/project/:id',auth.authjwt,(req,res)=>{
    apientries.admin(req,res,()=>projects.modifyProject(req.params.id,req.body));
});

app.delete('/admin/project/:id',auth.authjwt,(req,res)=>{
    apientries.admin(req,res,()=>projects.deleteProject(req.params.id));
});

app.post('/admin/user',auth.authjwt,(req,res)=>{
    apientries.admin(req,res,()=>users.createUser(req.body));
});

app.post('/admin/project',auth.authjwt,(req,res)=>{
    apientries.admin(req,res,()=>projects.createProject(req.body));
});

app.get('/tokens/info/:id',auth.authjwt,(req,res)=>{
    apientries.user(req,res,()=>tokens.getUserTokenInfos(req.params.id));
});

app.get('/tokens/stackbalance/',auth.authjwt,(req,res)=>{
    apientries.authclassic(req,res,()=>tokens.getGlobalTCBStackBalance());
});
   
app.post('/tokens/tcb/buy/:id',auth.authjwt,(req,res)=>{
    apientries.user(req,res,()=>tokens.buyTCB(req.params.id,req.body.amount));
});

app.post('/tokens/tcb/sell/:id',auth.authjwt,(req,res)=>{
    apientries.user(req,res,()=>tokens.sellTCB(req.params.id,req.body.amount));
});

app.post('/tokens/tcb/stack/:id',auth.authjwt,(req,res)=>{
    apientries.user(req,res,()=>tokens.stackTCB(req.params.id,req.body.amount));
});

app.post('/tokens/cc/buy/:id',auth.authjwt,(req,res)=>{
    apientries.user(req,res,()=>tokens.buyTCC(req.params.id,req.body.amount));
});

app.post('/tokens/cc/sell/:id',auth.authjwt,(req,res)=>{
    apientries.user(req,res,()=>tokens.sellTCC(req.params.id,req.body.amount));
});

app.post('/tokens/cc/burn/:id',auth.authjwt,(req,res)=>{
    apientries.user(req,res,()=>tokens.burnTCC(req.params.id,req.body.amount));
});

app.get('/transactions', (req, res) => {
    apientries.classic(req, res, ()=>transactions.getTransactions());
})

app.get('/reports', (req, res) => {
    apientries.classic(req, res, ()=>reports.getReports());
})

app.post("/create-payment-intent", async (req, res) => {
    apientries.classic(req, res, ()=>stripe.PostCreatePaymentIntent(req))
  });


app.use('*',(req, res) => {
    res.status(404).json({message:"RouteNotFound"});
});

module.exports = app;