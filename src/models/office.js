const Sequelize = require('sequelize');
let sequelize;

const initOfficeSchema =  () => {
    const Office =  sequelize.define('office', {

        phoneNumber: {
            type: Sequelize.STRING
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
        }
    });

    //TODO Office.sync just needed once to create tables, so if tables created dont need call it any more
    // await Office.sync({force: true})
    return Office
}
module.exports = (injectedSequelize) => {
    sequelize = injectedSequelize
    return {
        initOfficeSchema
    }
};