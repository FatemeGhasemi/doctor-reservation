const statusSchema = require('../models/status')();


const findStatusById = async (id) => {
    statusSchema.findOne({where: {id: id}})
};

const findStatusIdByName = async (name) => {
    const status = statusSchema.findOne({where: {name: name}})
    return status.id
};
module.exports = {findStatusById,findStatusIdByName}