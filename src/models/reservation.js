const Sequelize = require('sequelize');
const db = require('../db/sequelize-connection');
const reservationSchema = async () => {
    const sequelize = await db.init(Sequelize);
//
    const Reservation = await sequelize.define('reservation', {
        doctorId: {
            type: Sequelize.INTEGER,
            required: true
        },
        startTime: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        finishTime: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        counter: {
            type: Sequelize.INTEGER,
            required: true
        },
        flag:{
            type:Sequelize.BOOLEAN,
            readOnly:true,
            default:true
        }

    });
    await Reservation.sync({force: true})
}
module.exports = {reservationSchema}