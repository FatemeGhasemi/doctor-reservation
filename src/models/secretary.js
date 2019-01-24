const Sequelize = require('sequelize');
const db = require('../db/sequelize-connection');
const secretarySchema = async () => {
    const sequelize = await db.init(Sequelize);
//
    const Secretary = await sequelize.define('secretary', {
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
module.exports={secretarySchema}