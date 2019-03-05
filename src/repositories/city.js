const citySchema = require('../models/city')();

const findCityById = (id)=>{
    return citySchema.findOne({where:{id:id}})
}

const findCityByName = (name)=>{
    return citySchema.findOne({where: {name:name}})
}

module.exports={findCityById,findCityByName}
