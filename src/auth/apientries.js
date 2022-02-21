const auth = require('./auth');


function classic (req,res,func){
    func()
    .then(m => {
        res.json(m);
    })
    .catch(err => {
        res.status(err.code).json(err);
    })
};

function user (req,res,func){
    auth.verifyDecodedToken(req)
    .then(()=>auth.verifyUserOrAdmin(req,req.params.id))
    .then(func)
    .then(m => {
        res.json(m);
    })
    .catch(err => {
        res.status(err.code).json(err);
    })
}

function project (req,res,func){
    auth.verifyDecodedToken(req)
    .then(()=>auth.verifyProjectUserOrAdmin(req,req.params.id))
    .then(func)
    .then(m => {
        res.json(m);
    })
    .catch(err => {
        res.status(err.code).json(err);
    })
}

function admin (req,res,func){
    auth.verifyDecodedToken(req)
    .then(()=>auth.verifyAdmin(req))
    .then(func)
    .then(m => {
        res.json(m);
    })
    .catch(err => {
        res.status(err.code).json(err);
    })
}

module.exports = {
    classic,
    user,
    project,
    admin
}