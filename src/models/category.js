const Sequelize = require('sequelize');
let sequelize;
let Category;
const initCategorySchema = () => {
    Category = sequelize.define('category', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
        },
        parentName: {
            type: Sequelize.STRING,
            primaryKey:true,
            defaultValue:null
        },
        name: {
            type: Sequelize.STRING,
            unique: true,
            required: true,
            allowNull: false,
            primaryKey:true
        },
        displayName: {
            type: Sequelize.STRING,
            required: true,
            allowNull: false,
        },
        isAvailable:{
            type:Sequelize.BOOLEAN,
            defaultValue: true
        }
    });
    //TODO Category.sync just needed once to create tables, so if tables created dont need call it any more
    // await Category.sync({force: true})
    return Category
};

module.exports = (injectedSequelize) => {
    if (!injectedSequelize) {
        if (!Category) throw new Error('Plz define schemas by calling db.initDb');
        return Category
    }
    sequelize = injectedSequelize;
    return {
        initCategorySchema
    }
};