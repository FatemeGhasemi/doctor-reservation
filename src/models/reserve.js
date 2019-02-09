const Sequelize = require('sequelize');
let sequelize;
let Reserve;
const initReserveSchema =  () => {
    Reserve =  sequelize.define('reserve', {
        userId: {
            type: Sequelize.INTEGER,
            required: true
        },
        doctorId: {
            type: Sequelize.INTEGER,
            required: true
        },
        secretaryId: {
            type: Sequelize.INTEGER,
            required: true
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
            type:Sequelize.NUMERIC
        },
        paymentId:{
            type:Sequelize.INTEGER
        }
    });
    //TODO Reserve.sync just needed once to create tables, so if tables created dont need call it any more
    // await Reserve.sync({force: true})
    return Reserve
};

module.exports = (injectedSequelize) => {
    if (!injectedSequelize){
        if (!Reserve) throw new Error('Plz define schemas by calling db.initDb(')
        return Reserve
    }
    sequelize = injectedSequelize;
    return {
        initReserveSchema
    }
};