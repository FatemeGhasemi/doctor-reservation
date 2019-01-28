const Sequelize = require('sequelize');
let sequelize;
const initSecretarySchema =  () => {
    const Secretary =  sequelize.define('secretary', {
        userId:{
            type:Sequelize.INTEGER,
            required:true,
            primaryKey:true
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
            required:true
        },
        isApproved: {
            type: Sequelize.BOOLEAN,
            default:false,
        }


    });
    //TODO Secretary.sync just needed once to create tables, so if tables created dont need call it any more
    // await Secretary.sync({force: true})
    return Secretary
}

module.exports=(injectedSequelize) =>{
    sequelize = injectedSequelize;
    return {
        initSecretarySchema
    }
};