const Sequelize = require('sequelize');
let sequelize;
const secretarySchema = async () => {
    const Secretary = await sequelize.define('secretary', {
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
            readOnly:true,
            default:false,
        }


    });
    await Secretary.sync({force: true})
}

module.exports=(injectedSequelize) =>{
    sequelize = injectedSequelize
    return {
        secretarySchema
    }
};