const citySchema = require('../models/city')();

const findCityById = (id) => {
    return citySchema.findOne({where: {id: id}})
}

const findCityByName = (name) => {
    return citySchema.findOne({where: {name: name}})
}

const createNewCity = (data) => {
    return citySchema.create(data)
}

const deleteCity = (cityId) => {
    return citySchema.destroy({
        where: { id: cityId }
    })

}

const updateCityData = (cityId, data) => {
    return citySchema.update({name: data.name, displayName: data.displayName, code: data.code}, {
        returning: true,
        where: {id: cityId}
    })
}

const searchCityByCode = (code) => {
    return citySchema.findOne({where: {code: code}})
}


module.exports = {
    findCityById,
    findCityByName,
    createNewCity,
    deleteCity,
    updateCityData,
    searchCityByCode

}
