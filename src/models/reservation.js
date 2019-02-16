const Sequelize = require('sequelize');
let sequelize;
let Reservation;
const initReservationSchema = () => {
    Reservation = sequelize.define('reservation', {
        officeId: {
            type: Sequelize.INTEGER,
            required: true,
            allowNull: false,
            unique: 'uniqueTag'
        },
        startTime: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: 'uniqueTag'
        },
        finishTime: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: 'uniqueTag'


        },
        counter: {
            type: Sequelize.ARRAY(Sequelize.STRING),
            required: true
        },
        status: {
            type: Sequelize.STRING,
            defaultValue: "approved"
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
