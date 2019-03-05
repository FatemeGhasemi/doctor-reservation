const Sequelize = require('sequelize');
let sequelize;
let City;
const initCitySchema = () => {
    City = sequelize.define('city', {
        code: {
            type: Sequelize.INTEGER,
            unique: true
        },
        name: {
            type: Sequelize.STRING,
            unique:true
        },
        displayName:{
            type:Sequelize.STRING,
            unique:true

        }


    });
    //TODO City.sync just needed once to create tables, so if tables created dont need call it any more
    // await Status.sync({force: true})
    return City
};

module.exports = (injectedSequelize) => {
    if (!injectedSequelize) {
        if (!City) throw new Error('Plz define schemas by calling db.initDb(');
        return City
    }
    sequelize = injectedSequelize;
    return {
        initCitySchema
    }
};
