let categorySchema = require('../models/category')();


const findCategoryByParentId = async (parentId) => {
    return categorySchema.findOne({where: {parentId: parentId}})
};


const findCategoryByName = async (name) => {
    return categorySchema.findOne({where: {name: name}})
};


const crateNewCategory = async (parentId, name) => {
    categorySchema.create({parentId: parentId, name: name})
};


const updateCategoryData = async (id) => {
    categorySchema.update({name: data.name, parentId: data.parentId},
        {returning: true, where: {id: id}}
    )
};


module.exports = {
    findCategoryByParentId, findCategoryByName, crateNewCategory, updateCategoryData
}
