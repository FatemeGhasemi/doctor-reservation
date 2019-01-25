const Sequelize = require('sequelize');
const db = require('../db/sequelize-connection');
const officeSchema = async () => {
    const sequelize = await db.init(Sequelize);
//
    const Office = await sequelize.define('office', {

        phoneNumber: {
            type: Sequelize.STRING
        },
        lat: {
            type: Sequelize.DECIMAL
        },
        long: {
            type: Sequelize.DECIMAL
        },
        type: {
            type: Sequelize.STRING
        },
        secretaryId: {
            type: Sequelize.ARRAY(Sequelize.INTEGER)

        },
        address: {
            type: Sequelize.STRING
        }
    });
    await Office.sync({force: true})
}
module.exports={officeSchema}