const User = require('../schemas/users').User;
const Project = require('../schemas/projects').Project;
const Modif = require('../schemas/modifs').Modif;

const getUsers = async ()=>{
    let users = await User.find({},"-TCBAddress -TCBBalance -TCCBalance -TCBStack -transactions -certificates");
    return {users};
};

const getUser = async (id)=>{
    let user = await User.findOne({_id : id},"-TCBAddress -TCBBalance -TCCBalance -TCBStack -transactions -certificates");
    if (user == null) throw {code:404, message:"UserNotFound"};
    return user;
};

const InvestorSignUp = async (user)=>{
    //verifie si l'utilisateur n'existe deja pas avec le meme email
    let exuser= await User.findOne({email:user.email});
    if (exuser != null) throw {code:409 ,message:"UserAlreadyExists"};
    //ajoute l'utilisateur
    let newuser = new User(user);
    newuser.role = "investor";
    await newuser.save();
    return {message:"AccountCreated"};
};

const modifyPassword = async (id,body)=>{
    let user = await User.findById(id);
    if(user == 0) throw {code:404 ,message:"UserNotFound"};
    if(user.password != body.currentPassword) throw {code:403, message:"WrongPassord"};
    user.password = body.newPassword;
    await user.save();
    return {message:"PasswordModified"};
}

const requestModifyUser = async(id,mods)=>{
    let user = await User.findById(id);
    if(user == 0) throw {code:404 ,message:"UserNotFound"};
    let modif = new Modif({modCollection:"users",modId:id,askForDelete:false,user:mods});
    await modif.save();
    return {message:"ModifAsked"};
}
const requestDeleteUser = async(id)=>{
    let user = await User.findById(id);
    if(user == 0) throw {code:404 ,message:"UserNotFound"};
    let modif = new Modif({modCollection:"users",modId:id,askForDelete:true});
    await modif.save();
    return {message:"ModifAsked"};
}


const modifyUser = async(id,mods)=>{
    let user = await User.findById(id);
    if(user == null) throw {code:404,message:"UserNotFound"};
    if(mods.email) user.email = mods.email;
    if(mods.companyName) user.companyName = mods.companyName;
    if(mods.name) user.name = mods.name;
    if(mods.firstName) user.firstName = mods.firstName;
    if(mods.phone) user.phone = mods.phone;
    if(mods.address) user.address = mods.address;
    if(mods.country) user.country = mods.country;
    if(mods.city) user.city = mods.city;
    if(mods.zipCode) user.zipCode = mods.zipCode;
    try{
    await user.save();
    return {message:"ProjectModified"};
    }
    catch(err){
        throw {code:500,message:JSON.stringify(err)}
    }
}

const deleteUser = async(id)=>{
    let projects = await Project.find({userId:id});
    if(projects.length>0) throw {code:409,message:'UserHasProjects'};
    let user = await User.findByIdAndDelete(id);
    if (user == null) throw {code:404,message:"UserNotFound"};
    return {message:"UserDeleted"};
}

const createUser = async(user)=>{
    let exuser= await User.findOne({email:user.email});
    if (exuser != null) throw {code:409 ,message:"UserAlreadyExists"};
    //ajoute l'utilisateur
    let newuser = new User(user);
    await newuser.save();
    return {message:"AccountCreated"};
};


module.exports = {
    getUsers,
    getUser,
    InvestorSignUp,
    requestModifyUser,
    requestDeleteUser,
    modifyPassword,
    modifyUser,
    deleteUser,
    createUser
}