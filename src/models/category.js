const Sequelize = require('sequelize');
let sequelize;
let Category;
const initCategorySchema = () => {
    Category = sequelize.define('category', {
        parentId: {
            type: Sequelize.INTEGER,
            defaultValue: null
        },
        name: {
            type: Sequelize.STRING
        }
    });
    //TODO Category.sync just needed once to create tables, so if tables created dont need call it any more
    // await Category.sync({force: true})
    return Category
};

module.exports = (injectedSequelize) => {
    if (!injectedSequelize) {
        if (!Category) throw new Error('Plz define schemas by calling db.initDb(');
        return Category
    }
    sequelize = injectedSequelize;
    return {
        initCategorySchema
    }
};