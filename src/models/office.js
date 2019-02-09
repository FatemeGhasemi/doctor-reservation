const Sequelize = require('sequelize');
let sequelize;
let Office;

const initOfficeSchema = () => {
    Office = sequelize.define('office', {

        phoneNumber: {
            type: Sequelize.ARRAY(Sequelize.STRING)
        },
        lat: {
            type: Sequelize.DECIMAL
        },
        long: {
            type: Sequelize.DECIMAL
        },
        type: {
            type: Sequelize.STRING
        },
        secretaryId: {
            type: Sequelize.ARRAY(Sequelize.INTEGER)

        },
        address: {
            type: Sequelize.STRING
        },
        doctorId: {
            type: Sequelize.INTEGER,
            required: true
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