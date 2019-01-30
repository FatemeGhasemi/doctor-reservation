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

const findCategoryByName = async (name)=>{
    const categorySchema = await getCategorySchema();
    return categorySchema.findOne({where: {name: name}})
};

module.exports = {
    findCategoryByParentId, findCategoryByName
}
