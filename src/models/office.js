const Sequelize = require('sequelize');
let sequelize;
let Office;

const initOfficeSchema = () => {
    Office = sequelize.define('office', {
        phoneNumber: {
            type: Sequelize.STRING
        },
        geom: {
            type: Sequelize.GEOMETRY('POINT'),
            allowNull: false
        },
        lat:{
            type:Sequelize.FLOAT
        },
        long:{
            type:Sequelize.FLOAT

        },
        type: {
            type: Sequelize.STRING
        },
        secretaryId: {
            type: Sequelize.INTEGER
        },
        address: {
            type: Sequelize.STRING
        },
        doctorId: {
            type: Sequelize.INTEGER,
            required: true,
        },
        active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        }
    });

    //TODO Office.sync just needed once to create tables, so if tables created dont need call it any more
    // await Office.sync({force: true})
    return Office
};

module.exports = (injectedSequelize) => {
    if (!injectedSequelize) {
        if (!Office) throw new Error('Plz define schemas by calling db.initDb(');
        return Office
    }
    sequelize = injectedSequelize;
    return {
        initOfficeSchema
    }
};