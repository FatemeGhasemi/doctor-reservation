const Sequelize = require('sequelize');
const db = require('../db/db');
const doctorSchema = async () => {
    const sequelize = await db.getInstance(Sequelize);
//
    const Doctor = await sequelize.define('doctor', {
        userId:{
            type:Sequelize.INTEGER,
            required:true,
            primaryKey:true
        },
        officeId: {
            type: Sequelize.ARRAY(Sequelize.INTEGER),
            required:true
        },
        firstName: {
            type: Sequelize.STRING,
            required:true

        },
        lastName: {
            type: Sequelize.STRING,
            required:true

        },
        categoryId: {
            type: Sequelize.STRING,
            required:true

        },
        phoneNumber: {
            type: Sequelize.STRING,
            required:true

        },
        description: {
            type: Sequelize.STRING
        },
        isApproved:{
            type:Sequelize.BOOLEAN,
            default:false,
        }

    });
    await Doctor.sync({force: true})
}
module.exports={doctorSchema}