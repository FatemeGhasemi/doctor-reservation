const Sequelize = require('sequelize');
const db = require('../db/sequelize-connection');
const reservationSchema = async () => {
    const sequelize = await db.init(Sequelize);
//
    const Reservation = await sequelize.define('user', {

        start: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        finish: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        counter: {
            type: Sequelize.INTEGER
        }

    });
    await Reservation.sync({force: true})
}
module.exports={reservationSchema}