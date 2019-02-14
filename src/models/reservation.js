const Sequelize = require('sequelize');
let sequelize;
let Reservation;
const initReservationSchema = () => {
    Reservation = sequelize.define('reservation', {
        officeId: {
            type: Sequelize.INTEGER,
            required: true
        },
        startTime: {
            type: Sequelize.STRING,
            unique: true
        },
        finishTime: {
            type: Sequelize.STRING,
            unique:true

        },
        counter: {
            type: Sequelize.ARRAY(Sequelize.STRING),
            required: true
        },
        status: {
            type: Sequelize.STRING,
            defaultValue: "pending"
        },
        doctorId: {
            type: Sequelize.INTEGER,
            required: true
        }

    });
    //TODO Reservation.sync just needed once to create tables, so if tables created dont need call it any more
    // await Reservation.sync({force: true})
    return Reservation
};

module.exports = (injectedSequelize) => {
    if (!injectedSequelize) {
        if (!Reservation) throw new Error('Plz define schemas by calling db.initDb(')
        return Reservation
    }
    sequelize = injectedSequelize;
    return {
        initReservationSchema
    }
};
