const Sequelize = require('sequelize');
let sequelize;
let Category;
const initCategorySchema = () => {
    Category = sequelize.define('category', {
        parentName: {
            type: Sequelize.STRING,
            defaultValue: null
        },
        name: {
            type: Sequelize.STRING,
            required: true,
            allowNull: false,
        },
        displayName: {
            type: Sequelize.STRING,
            required: true,
            allowNull: false,
        },
        isAvailable: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        photoUrl:{
            type: Sequelize.STRING,
            defaultValue: "https://filedn.com/l09SUUreq5ifuLbBenJHcmf/reservation/slide-03.jpg"

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
