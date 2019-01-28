const Sequelize = require('sequelize');
let sequelize;
const initReservationSchema =  () => {
    const Reservation =  sequelize.define('reservation', {
        officeId: {
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
        status:{
            type:Sequelize.BOOLEAN,
            default:true
        }

    });
    //TODO Reservation.sync just needed once to create tables, so if tables created dont need call it any more
    // await Reservation.sync({force: true})
    return Reservation
};

module.exports = (injectedSequelize) => {
    sequelize = injectedSequelize;
    return {
        initReservationSchema
    }
};
