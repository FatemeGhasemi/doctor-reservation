let categorySchema = require('../models/category')();


const findCategoryByParentName = async (parentName) => {
    return categorySchema.findOne({where: {parentName: parentName}})
};


const findCategoryByName = async (name) => {
    return categorySchema.findOne({where: {name: name}})
};


const crateNewCategory = async (parentName, name) => {
    return categorySchema.create({parentName: parentName, name: name})
};


const updateCategoryData = async (id, data) => {
    return categorySchema.update({name: data.name, parentId: data.parentId},
        {returning: true, where: {id:id}}
    )
};


module.exports = {
    findCategoryByParentName, findCategoryByName, crateNewCategory, updateCategoryData
};
