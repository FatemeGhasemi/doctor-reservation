const Sequelize = require('sequelize');
let sequelize;
let Reserve;
const initReserveSchema = () => {
    Reserve = sequelize.define('reserve', {
        userId: {
            type: Sequelize.INTEGER,
            required: true,
            allowNull:false
        },
        doctorId: {
            type: Sequelize.INTEGER,
            required: true,
            allowNull:false
        },
        secretaryId: {
            type: Sequelize.INTEGER,
            required: true,
            allowNull:false
        },
        status: {
            type: Sequelize.STRING,
            defaultValue: "approved"
        },
        reserveTime: {
            type: Sequelize.STRING,
            required: true,
            allowNull: false,
            unique: 'uniqueTag'
        },
        officeId: {
            type: Sequelize.INTEGER,
            required: true,
            allowNull: false,
            unique: 'uniqueTag'
        },
        price: {
            type: Sequelize.NUMERIC
        },
        paymentId: {
            type: Sequelize.INTEGER
        },
        reservationId: {
            type: Sequelize.INTEGER,
            required: true,
            allowNull: false
        }
    // ,{
    //     indexes: [
    //         {
    //             unique: true,
    //             fields: ['officeId', 'reserveTime']
    //         }
    //     ]
    // }
})
    ;
    //TODO Reserve.sync just needed once to create tables, so if tables created dont need call it any more
    // await Reserve.sync({force: true})
    return Reserve
};

module.exports = (injectedSequelize) => {
    if (!injectedSequelize) {
        if (!Reserve) throw new Error('Plz define schemas by calling db.initDb(')
        return Reserve
    }
    sequelize = injectedSequelize;
    return {
        initReserveSchema
    }
};