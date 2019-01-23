const Sequelize = require('sequelize');
const db = require('../db/sequelize-connection');
const officeSchema = async () => {
    const sequelize = await db.init(Sequelize);
//
    const Office = await sequelize.define('user', {

        phoneNumber: {
            type: Sequelize.STRING
        },
        location: {
            type: Sequelize.ARRAY(Sequelize.DECIMAL)
            // type:Sequelize.GEOMETRY

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