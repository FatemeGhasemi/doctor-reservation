const Sequelize = require('sequelize');
let sequelize;
let Rate;
const initRateSchema = () => {
    Rate = sequelize.define('rate', {
        doctorId: {
            type: Sequelize.INTEGER,
            allowNull:false
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull:false

        },
        rate:{
            type:Sequelize.INTEGER,
            allowNull:false

        }


    });
    //TODO Rate.sync just needed once to create tables, so if tables created dont need call it any more
    // await Status.sync({force: true})
    return Rate
};

module.exports = (injectedSequelize) => {
    if (!injectedSequelize) {
        if (!Rate) throw new Error('Plz define schemas by calling db.initDb(');
        return Rate
    }
    sequelize = injectedSequelize;
    return {
        initRateSchema
    }
};
