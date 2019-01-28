const Sequelize = require('sequelize');
let sequelize;
const initCategorySchema =  () => {
    const Category =  sequelize.define('category', {
        parentId: {
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING
        }
    });
    //TODO Category.sync just needed once to create tables, so if tables created dont need call it any more
    // await Category.sync({force: true})
    return Category
}
module.exports = (injectedSequelize) => {
    sequelize = injectedSequelize;
    return {
        initCategorySchema
    }
};