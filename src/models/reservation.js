const Sequelize = require('sequelize');
let sequelize;
let Reservation;
const initReservationSchema = () => {
    Reservation = sequelize.define('reservation', {
        officeId: {
            type: Sequelize.INTEGER,
            required: true,
            allowNull: false
        },
        dates: {
            type: Sequelize.ARRAY(Sequelize.JSON(Sequelize.STRING)),
            required: true,
            allowNull: false,
        },
        status: {
            type: Sequelize.STRING,
            defaultValue: "valid"
        },
        doctorId: {
            type: Sequelize.INTEGER,
            required: true
        },
        secretaryId:{
            type: Sequelize.INTEGER,
            required:true,
            allowNull:false
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
