const Modif = require('../schemas/modifs').Modif;
const User = require('../schemas/users').User;
const Project = require('../schemas/projects').Project;

const getModifs= async ()=>{
    const modifs = await Modif.find({});
    return {modifs};
};

const modifyModif = async (id,mods)=>{
    let modif = await Modif.findById(id);
    if(modif == null) throw {code:404,message:"ModifNotFound"};
    if(modif.modCollection == "users"){
        if(mods.email) modif.user.email = mods.email;
        else if(mods.email===false) modif.user.email = undefined;
        if(mods.companyName) modif.user.companyName = mods.companyName;
        else if(mods.companyName===false) modif.user.companyName = undefined;
        if(mods.name) modif.user.name = mods.name;
        else if(mods.name===false) modif.user.name = undefined;
        if(mods.firstName) modif.user.firstName = mods.firstName;
        else if(mods.firstName===false) modif.user.firstName = undefined;
        if(mods.phone) modif.user.phone = mods.phone;
        else if(mods.phone===false) modif.user.phone = undefined;
        if(mods.address) modif.user.address = mods.address;
        else if(mods.address===false) modif.user.address = undefined;
        if(mods.country) modif.user.country = mods.country;
        else if(mods.country===false) modif.user.country = undefined;
        if(mods.city) modif.user.city = mods.city;
        else if(mods.city===false) modif.user.city = undefined;
        if(mods.zipCode) modif.user.zipCode = mods.zipCode;
        else if(mods.zipCode===false) modif.user.zipCode = undefined;
    }
    if(modif.modCollection == "projects"){
        if(mods.name) modif.project.name = mods.name;
        else if(mods.name===false) modif.project.name = undefined;
        if(mods.address) modif.project.address = mods.address;
        else if(mods.address===false) modif.project.address = undefined;
        if(mods.country) modif.project.country = mods.country;
        else if(mods.country===false) modif.project.country = undefined;
        if(mods.city) modif.project.city = mods.city;
        else if(mods.city===false) modif.project.city = undefined;
        if(mods.zipCode) modif.project.zipCode = mods.zipCode;
        else if(mods.zipCode===false) modif.project.zipCode = undefined;
        if(mods.description) modif.project.description = mods.description;
        else if(mods.description===false) modif.project.description = undefined;
        if(mods.estimatedFundVolume) modif.project.estimatedFundVolume = mods.estimatedFundVolume;
        else if(mods.estimatedFundVolume===false) modif.project.estimatedFundVolume = undefined;
        if(mods.expectedRevenue) modif.project.expectedRevenue = mods.expectedRevenue;
        else if(mods.expectedRevenue===false) modif.project.expectedRevenue = undefined;
    }
    await modif.save();
    return {message:"ModifModified"};
};

const validateModif= async (id)=>{
    let modif = await Modif.findById(id);
    if (modif == null) throw {code:404,message:"ModifNotFound"};
    if(modif.askForDelete===true)
    {
        if(modif.modCollection=="users")
        {
            let projects = await Project.find({userId:modif.modId});
            if(projects.length>0) throw {code:409,message:'UserHasProjects'};
            let user = await User.findByIdAndDelete(modif.modId);
            if (user == null) throw {code:404,message:"UserNotFound"};

        }
        if(modif.modCollection=="projects")
        {
            let project = await Project.findByIdAndDelete(modif.modId);
            if (project == null) throw {code:404,message:"ProjectNotFound"};
        }
    }
    else
    {
        if(modif.modCollection=="users")
        {
            let user = await User.findById(modif.modId);
            if (user == null) throw {code:404,message:"UserNotFound"};
            if(modif.user.email) user.email = modif.user.email;
            if(modif.user.companyName) user.companyName = modif.user.companyName;
            if(modif.user.name) user.name = modif.user.name;
            if(modif.user.firstName) user.firstName = modif.user.firstName;
            if(modif.user.phone) user.phone = modif.user.phone;
            if(modif.user.address) user.address = modif.user.address;
            if(modif.user.country) user.country = modif.userds.country;
            if(modif.user.city) user.city = modif.user.city;
            if(modif.user.zipCode) user.zipCode = modif.user.zipCode;
            await user.save();
        }
        if(modif.modCollection=="projects")
        {
            let project = await Project.findById(modif.modId);
            if (project == null) throw {code:404,message:"ProjectNotFound"};
            if(modif.project.name) project.name = modif.project.name;
            if(modif.project.address) project.address = modif.project.address;
            if(modif.project.country) project.country = modif.project.country;
            if(modif.project.city) project.city = modif.project.city;
            if(modif.project.zipCode) project.zipCode = modif.project.zipCode;
            if(modif.project.description) project.description = modif.project.description;
            if(modif.project.estimatedFundVolume) project.estimatedFundVolume = modif.project.estimatedFundVolume;
            if(modif.project.expectedRevenue) project.expectedRevenue = modif.project.expectedRevenue;
            await project.save();
        }
    }
    await Modif.findByIdAndDelete(id);
    return {message:"ModifValidated"}

}
const deleteModif = async (id)=>{
    let modif = await Modif.findByIdAndDelete(id);
    if (modif == null) throw {code:404,message:"ModifNotFound"};
    return {message:"ModifDeleted"};
}
module.exports = {
    getModifs,
    modifyModif,
    validateModif,
    deleteModif
}