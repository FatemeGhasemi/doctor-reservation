const Sequelize = require('sequelize');
let sequelize;
let Insurance;
const initInsuranceSchema = () => {
    Insurance = sequelize.define('status', {
        name: {
            type: Sequelize.STRING,
            required: true,
            unique:true
        },
        displayName: {
            type: Sequelize.STRING,
            required: true,
            unique:true
        }

    });
    //TODO Insurance.sync just needed once to create tables, so if tables created dont need call it any more
    // await Insurance.sync({force: true})
    return Insurance
};

module.exports = (injectedSequelize) => {
    if (!injectedSequelize) {
        if (!Insurance) throw new Error('Plz define schemas by calling db.initDb(');
        return Insurance
    }
    sequelize = injectedSequelize;
    return {
        initInsuranceSchema
    }
};