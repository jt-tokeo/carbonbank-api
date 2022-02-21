const User = require("../schemas/users").User;

const rate = 52.34;

const getUserTokenInfos= async(id)=>{
    const user = await User.findById(id);
    if (user == null) throw {code:404, message:"UserNotFound"};
    let tokenInfo = {
        TCBAddress : user.TCBAddress,
        TCBBalance : user.TCBBalance,
        TCCBalance : user.TCCBalance,
        TCBStack : user.TCBStack,
        transactions :user.transactions,
        certificates:user.certificates
    };
    if(!tokenInfo.TCBAddress) tokenInfo.TCBAddress=null;
    if(!tokenInfo.TCBBalance) tokenInfo.TCBBalance=0.0;
    if(!tokenInfo.TCCBalance) tokenInfo.TCCBalance=0.0;
    if(!tokenInfo.TCBStack) tokenInfo.TCBStack=0.0;
    if(!tokenInfo.transactions) tokenInfo.transactions = [];
    if(!tokenInfo.certificates) tokenInfo.certificates = [];
    return tokenInfo;
}
const getGlobalTCBStackBalance= async ()=>{
    const users = await User.find({});
    let balance = 0;
    for (const user of users)
    {
        if (user.TCBStack){
            balance += user.TCBStack;
        }
    }
    return {balance};
}

const buyTCB = async (id,amount) => {
    let user = await User.findById(id);
    if (user == null) throw {code:404, message:"UserNotFound"};

    if(!user.TCBBalance) user.TCBBalance=0.0;
    if(!user.transactions) user.transactions = [];

    user.TCBBalance += amount;
    user.transactions.push({
        typeToken : "tcb", 
        action : "buy", 
        amount : amount,
        date : new Date()
    });
    await user.save();
    return {message: "TCBBought"}
}

const sellTCB = async (id,amount) => {
    let user = await User.findById(id);
    if (user == null) throw {code:404, message:"UserNotFound"};

    if(!user.TCBBalance) user.TCBBalance=0.0;
    if(!user.transactions) user.transactions = [];

    if(user.TCBBalance < amount) throw {code:409,message:"NotEnoughTCB"};

    user.TCBBalance -= amount;
    user.transactions.push({
        typeToken : "tcb", 
        action : "sell", 
        amount : amount,
        date : new Date()
    });
    await user.save();
    return {message: "TCBSold"}
}

const stackTCB = async (id,amount) => {
    let user = await User.findById(id);
    if (user == null) throw {code:404, message:"UserNotFound"};

    if(!user.TCBBalance) user.TCBBalance=0.0;
    if(!user.TCBStack) user.TCBStack=0.0;
    if(!user.transactions) user.transactions = [];

    if(user.TCBBalance < amount) throw {code:409,message:"NotEnoughTCB"};

    user.TCBBalance -= amount;
    user.TCBStack += amount;
    user.transactions.push({
        typeToken : "tcb", 
        action : "stack", 
        amount : amount,
        date : new Date()
    });
    await user.save();
    return {message: "TCBStacked"}
}

const buyTCC = async (id,amount) => {
    let user = await User.findById(id);
    if (user == null) throw {code:404, message:"UserNotFound"};

    if(!user.TCBBalance) user.TCBBalance=0.0;
    if(!user.TCCBalance) user.TCCBalance=0.0;
    if(!user.transactions) user.transactions = [];

    if(user.TCBBalance < amount*rate) throw {code:409,message:"NotEnoughTCB"};

    user.TCBBalance -= amount*rate;
    user.TCCBalance += amount;
    user.transactions.push({
        typeToken : "cc", 
        action : "buy", 
        amount : amount,
        date : new Date()
    });
    await user.save();
    return {message: "CCBought"}
}

const sellTCC = async (id,amount) => {
    let user = await User.findById(id);
    if (user == null) throw {code:404, message:"UserNotFound"};

    if(!user.TCBBalance) user.TCBBalance=0.0;
    if(!user.TCCBalance) user.TCCBalance=0.0;
    if(!user.transactions) user.transactions = [];

    if(user.TCCBalance < amount) throw {code:409,message:"NotEnoughCC"};

    user.TCBBalance += amount*rate;
    user.TCCBalance -= amount;
    user.transactions.push({
        typeToken : "cc", 
        action : "sell", 
        amount : amount,
        date : new Date()
    });
    await user.save();
    return {message: "CCSold"}
}

const burnTCC = async (id,amount) => {
    let user = await User.findById(id);
    if (user == null) throw {code:404, message:"UserNotFound"};

    if(!user.TCBBalance) user.TCBBalance=0.0;
    if(!user.TCCBalance) user.TCCBalance=0.0;
    if(!user.transactions) user.transactions = [];
    if(!user.certificates) user.certificates = [];

    if(user.TCCBalance < amount) throw {code:409,message:"NotEnoughCC"};

    user.TCCBalance -= amount;
    user.transactions.push({
        typeToken : "cc", 
        action : "burn", 
        amount : amount,
        date : new Date()
    });
    user.certificates.push({
        amount:amount,
        date:new Date()
    });
    await user.save();
    return {message: "CCBurned"}
}

module.exports = {
    getUserTokenInfos,
    getGlobalTCBStackBalance,
    buyTCB,
    sellTCB,
    stackTCB,
    buyTCC,
    sellTCC,
    burnTCC
}