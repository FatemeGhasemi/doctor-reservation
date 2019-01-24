const Sequelize = require('sequelize');
const db = require('../db/sequelize-connection');
const doctorSchema = async () => {
    const sequelize = await db.init(Sequelize);
//
    const Doctor = await sequelize.define('doctor', {
        officeId: {
            type: Sequelize.ARRAY(Sequelize.INTEGER)
        },
        firstName: {
            type: Sequelize.STRING
        },
        lastName: {
            type: Sequelize.STRING
        },
        categoryId: {
            type: Sequelize.STRING
        },
        phoneNumber: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        isApproved:{
            type:Sequelize.BOOLEAN
        }

    });
    await Doctor.sync({force: true})
}
module.exports={doctorSchema}