const Sequelize = require('sequelize');
const db = require('../db/sequelize-connection');
const secretarySchema = async () => {
    const sequelize = await db.init(Sequelize);
//
    const Secretary = await sequelize.define('secretary', {
        mobile: {
            type: Sequelize.STRING
        },
        userId: {
            type: Sequelize.INTEGER
        },
        flag: {
            type: Sequelize.BOOLEAN
        }


    });
    await Secretary.sync({force: true})
}
module.exports={secretarySchema}