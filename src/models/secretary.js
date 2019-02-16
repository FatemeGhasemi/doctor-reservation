const Sequelize = require('sequelize');
let sequelize;
let Secretary;
const initSecretarySchema =  () => {
     Secretary =  sequelize.define('secretary', {
        userId:{
            type:Sequelize.INTEGER,
            required:true,
        },
        firstName: {
            type: Sequelize.STRING,
            required:true
        },
        lastName: {
            type: Sequelize.STRING,
            required:true
        },
        phoneNumber: {
            type: Sequelize.STRING,
            required:true,
            unique:true
        },
        status: {
            type: Sequelize.STRING,
            defaultValue: "pending"
        },
         active:{
            type:Sequelize.BOOLEAN,
             defaultValue: true
         },
         officeId:{
            type:Sequelize.INTEGER
         }
    });
    //TODO Secretary.sync just needed once to create tables, so if tables created dont need call it any more
    // await Secretary.sync({force: true})
    return Secretary
};

module.exports = (injectedSequelize) => {
    if (!injectedSequelize){
        if (!Secretary) throw new Error('Plz define schemas by calling db.initDb(')
        return Secretary
    }
    sequelize = injectedSequelize;
    return {
        initSecretarySchema
    }
};