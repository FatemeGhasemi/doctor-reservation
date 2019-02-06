const statusSchema = require('../models/status')();


const findStatusById = async (id) => {
    statusSchema.findOne({where: {id: id}})
};


module.exports = {findStatusById}