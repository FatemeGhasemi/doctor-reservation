const db = require('../db/db');
let categorySchemaInstance;

const getCategorySchema = async () => {
    if (categorySchemaInstance) return categorySchemaInstance;
    const sequelize = await db.getInstance();
    const categorySchema = require('../models/category')(sequelize);
    categorySchemaInstance = categorySchema.initCategorySchema();
    return categorySchemaInstance
};


const findCategoryByParentId = async (parentId) => {
    const categorySchema = await getCategorySchema();
    return categorySchema.findOne({where: {parentId: parentId}})
};


const findCategoryByName = async (name) => {
    const categorySchema = await getCategorySchema();
    return categorySchema.findOne({where: {name: name}})
};


const crateNewCategory = async (parentId, name) => {
    const categorySchema = await getCategorySchema();
    categorySchema.create({parentId: parentId, name: name})
};


const updateCategoryData = async (id) => {
    const categorySchema = await getCategorySchema();
    categorySchema.update({name: data.name, parentId: data.parentId},
        {returning: true, where: {id: id}}
    )
};


module.exports = {
    findCategoryByParentId, findCategoryByName, crateNewCategory, updateCategoryData
}
