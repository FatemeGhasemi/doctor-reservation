const Sequelize = require('sequelize');
const db = require('../db/sequelize-connection');
const doctorSchema = async () => {
    const sequelize = await db.init(Sequelize);
//
    const Doctor = await sequelize.define('doctor', {
        officeId: {
            type: Sequelize.ARRAY(Sequelize.INTEGER)
        },
        name: {
            type: Sequelize.STRING
        }


    });
    await Doctor.sync({force: true})
}
module.exports={doctorSchema}