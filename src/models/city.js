const Sequelize = require('sequelize');
let sequelize;
let City;
const initCitySchema = () => {
    City = sequelize.define('city', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true
        },
        code: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        province: {
            type: Sequelize.STRING,
            unique:true
        },
        displayName:{
            type:Sequelize.STRING
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
