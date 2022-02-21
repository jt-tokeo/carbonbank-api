const { Report } = require("../schemas/reports");

const getReports = async ()=>{
    let reports = await Report.find();
    return {reports};
};

module.exports = {
    getReports,
}