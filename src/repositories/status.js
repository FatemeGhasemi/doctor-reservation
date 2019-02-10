const statusSchema = require('../models/status')();


const findStatusById = async (id) => {
    return statusSchema.findOne({where: {id: id}})
};

const findStatusByName = async (name) => {
    return statusSchema.findOne({where: {name: name}})

};
module.exports = {findStatusById,findStatusByName}