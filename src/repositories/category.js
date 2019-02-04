let categorySchema = require('../models/category')();
// const op = Sequelize.Op;


const findCategoryByParentName = async (parentName) => {
    return categorySchema.findAll({
        where: {
            parentName:  parentName}
    })
};


const findCategoryByName = async (name) => {
    return categorySchema.findOne({
        where: {name: name}
    })
};



const findCategoryById = async (id) => {
    return categorySchema.findOne({where: {id: id}})
};


const crateNewCategory = async (parentName, name) => {
    return categorySchema.create({parentName: parentName, name: name})
};


const updateCategoryData = async (id, data) => {
    return categorySchema.update({name: data.name, parentName: data.parentName},
        {returning: true, where: {id: id}}
    )
};


const changeCategoryStatus = async (id) => {
    const category = await findCategoryById(id);
    if (category.isAvailable) {
        return categorySchema.update({isAvailable: false}, {returning: true, where: {id: id}})
    } else {
        return categorySchema.update({isAvailable: true}, {returning: true, where: {id: id}})
    }
};

const returnAllCategories = async (offset = 0, limit = 10) => {
    return categorySchema.findAll(
        {offset: offset, limit: limit},
    )
};


module.exports = {
    findCategoryByParentName,
    findCategoryByName,
    crateNewCategory,
    updateCategoryData,
    changeCategoryStatus,
    findCategoryById,
    returnAllCategories
};
