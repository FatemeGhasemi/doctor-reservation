const Sequelize = require('sequelize');
let sequelize;
let Advertise;
const initAdvertiseSchema = () => {
    Advertise = sequelize.define('advertise', {
        url: {
            type: Sequelize.STRING,
        },
        label: {
            type: Sequelize.STRING,
        },
        status:{
            type:Sequelize.STRING,
            defaultValue:"active"
        }


    });
    //TODO Advertise.sync just needed once to create tables, so if tables created dont need call it any more
    // await Advertise.sync({force: true})
    return Advertise
};

module.exports = (injectedSequelize) => {
    if (!injectedSequelize) {
        if (!Advertise) throw new Error('Plz define schemas by calling db.initDb(');
        return Advertise
    }
    sequelize = injectedSequelize;
    return {
        initAdvertiseSchema
    }
};
