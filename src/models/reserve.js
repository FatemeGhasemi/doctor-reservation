const Sequelize = require('sequelize');
let sequelize;
let Reserve;
const initReserveSchema =  () => {
    Reserve =  sequelize.define('reservation', {
        userId: {
            type: Sequelize.INTEGER,
            required: true
        },
        doctorId: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        secretaryId: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        reservationId: {
            type: Sequelize.INTEGER,
            required: true
        },
        statusId:{
            type:Sequelize.INTEGER,
            defaultValue:1
        },
        price:{
            type:Sequelize.NUMERIC,
        },
        paymentId:{
            type:Sequelize.INTEGER
        }

    });
    //TODO Reservation.sync just needed once to create tables, so if tables created dont need call it any more
    // await Reservation.sync({force: true})
    return Reservation
};

module.exports = (injectedSequelize) => {
    if (!injectedSequelize){
        if (!Reservation) throw new Error('Plz define schemas by calling db.initDb(')
        return Reservation
    }
    sequelize = injectedSequelize;
    return {
        initReserveSchema
    }
};