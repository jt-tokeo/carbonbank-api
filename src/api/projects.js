const Project = require('../schemas/projects').Project;
const User = require('../schemas/users').User;
const Modif = require('../schemas/modifs').Modif;

const ProjectDeposit = async (project)=>{
    //verifie si l'ulilisateur n'existe deja pas avec le meme email
    try{
        let user= await User.findOne({email:project.email});
        if (user == null) { 
        //si l'utilisateur n'existe pas, on le crée
            user = new User({
                email:project.email,
                role:"holder",
                companyName:project.companyName,
                name:project.name,
                firstName:project.firstName,
                phone:project.phone,
                address:project.address,
                country: project.country,
                zipCode:project.zipCode,
                city: project.city
            });
            await user.save();
        };
        //creation du projet
        let newproject = new Project({
            userId: user._id,
            address:project.address,
            country:project.country,
            city: project.city,
            zipCode: project.zipCode,
            name: project.projectName,
            description: project.description,
            estimatedFundVolume: project.estimatedFundVolume,
            expectedRevenue:project.expectedRevenue,
            depositDate : new Date(),
            published:false
        });
        await newproject.save();
        return {message:"ProjectSubmitted"}
    }
    catch(err){
        throw {code:500,message: err };
    }
};

const getProjects = async ()=>{
    let projects = await Project.find({published:true});
    return {projects};
};

const getProjectByUser = async (userId)=>{
    let user = await User.findOne({_id:userId});
    if (user == null) throw {code:404, message:"UserNotFound"};
    let projects = await Project.find({published:true,userId:userId});
    return {projects};
};

const getProject = async (id)=>{
    let project = await Project.findOne({_id:id,published:true});
    if (project == null) throw {code:404,message:'ProjectNotFound'}
    return project;
};

const getProjectAdmin = async (id)=>{
    let project = await Project.findOne({_id:id});
    if (project == null) throw {code:404,message:'ProjectNotFound'}
    return project;
};

const getProjectsAdmin = async ()=>{
    let projects = await Project.find({});
    return {projects};
};

const getUnpublishedProjects = async ()=>{
    let projects = await Project.find({published:false});
    return {projects};
};


const requestModifyProject = async(id,mods)=>{
    let project = await Project.findById(id);
    if(project == 0) throw {code:404 ,message:"ProjectNotFound"};
    let modif = new Modif({modCollection:"projects",modId:id,askForDelete:false,project:mods});
    await modif.save();
    return {message:"ModifAsked"};
}
const requestDeleteProject = async(id)=>{
    let project = await Project.findById(id);
    if(project == 0) throw {code:404 ,message:"ProjectNotFound"};
    let modif = new Modif({modCollection:"projects",modId:id,askForDelete:true});
    await modif.save();
    return {message:"ModifAsked"};
}

const modifyProject = async(id,mods)=>{
    let project = await Project.findById(id);
    if (project == null) throw {code:404,message:"ProjectNotFound"};
    if(mods.name) project.name = mods.name;
    if(mods.address) project.address = mods.address;
    if(mods.country) project.country = mods.country;
    if(mods.city) project.city = mods.city;
    if(mods.zipCode) project.zipCode = mods.zipCode;
    if(mods.description) project.description = mods.description;
    if(mods.estimatedFundVolume) project.estimatedFundVolume = mods.estimatedFundVolume;
    if(mods.expectedRevenue) project.expectedRevenue = mods.expectedRevenue;
    if(mods.latitude || mods.latitude == 0) project.latitude = mods.latitude;
    if(mods.longitude|| mods.latitude == 0) project.longitude = mods.longitude;
    await project.save();
    return {message:"ProjectModified"};
}

const deleteProject = async(id)=>{
    let project = await Project.findByIdAndDelete(id);
    if (project == null) throw {code:404,message:"ProjectNotFound"};
    return {message:"ProjectDeleted"};
}

const createProject = async(project)=>{
    let user = await User.findById(project.userId);
    if (user == null) throw {code:404,message:"UserNotFound"};
    let newproject = new Project({
        userId: project.userId,
        address:project.address,
        country:project.country,
        city: project.city,
        zipCode: project.zipCode,
        name: project.name,
        description: project.description,
        estimatedFundVolume: project.estimatedFundVolume,
        expectedRevenue:project.expectedRevenue,
        latitude:project.latitude,
        longitude:project.longitude,
        depositDate : new Date(),
        published:false
    });
    await newproject.save();
    return {message:"ProjectSubmitted"}

}

module.exports = {
    getProject,
    getProjects,
    getProjectByUser,
    ProjectDeposit,
    requestModifyProject,
    requestDeleteProject,
    getProjectAdmin,
    getProjectsAdmin,
    getUnpublishedProjects,
    modifyProject,
    deleteProject,
    createProject
};