const jwt = require('jsonwebtoken');

const secretword = require('../secret.json').secret;

const User = require('../schemas/users').User;
const Project = require('../schemas/projects').Project;

const login = async (user)=>{
    let exuser = await User.findOne({email:user.email});
    if (exuser == null) throw {code:403, message:"EmailDoesNotExist"};
    if (exuser.password != user.password) throw {code:403, message:"WrongPassord"};

    let decodedToken = { "id":exuser._id , "logDate": new Date()};
    const token = jwt.sign(decodedToken,secretword);
    return {token, role:exuser.role,id:exuser._id};
};

const authjwt = (req,res,next)=>{
    const authheader = req.headers.authorization;
    if( authheader && authheader.split(' ')[0]=="Bearer"){
        
        const token = authheader.split(' ')[1];
        try{
            let decoded = jwt.verify(token,secretword);
            req.tokenUser = decoded;
            next();

        }
        catch(err)
        {
            res.status(403).send(JSON.stringify({code:403,message:"wrongToken"}));
        }
       
    }
    else
    {
        res.status(401).send(JSON.stringify({code:401,message:"tokenMissing"}));
    }
}

const verifyDecodedToken = async (req)=>{
    let user = await User.findOne({_id:req.tokenUser.id});
    if (user == null) throw {code:403, message:"TokenUserNotFound"};
    req.tokenUser.role = user.role;
    //if (new Date().valueOf() - dToken.logDate.valueOf() > 1000*3600*12) // expiration du token au bout de 12 heures (periode à ajuster au besoin)
       // throw {code:403, message:"session expirée"};
}

const verifyAdmin = async (req)=>{
    if(req.tokenUser.role != "admin") throw {code:403, message:"UnauthorizedUser"};
};

const verifyUserOrAdmin = async (req,id)=>{
    if(req.tokenUser.id != id && req.tokenUser.role != "admin") throw {code:403, message:"UnauthorizedUser"};
};

const verifyProjectUserOrAdmin = async (req,id)=>{
    let project = await Project.findById(id);
    if(req.tokenUser.id != project.userId && req.tokenUser.role != "admin") throw {code:403, message:"UnauthorizedUser"};
};
module.exports = {
    login,
    authjwt,
    verifyDecodedToken,
    verifyAdmin,
    verifyUserOrAdmin,
    verifyProjectUserOrAdmin
 };