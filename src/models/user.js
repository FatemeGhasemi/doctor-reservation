const Sequelize = require('sequelize');
let sequelize;
const initUserSchema = () => {
    const User = sequelize.define('user', {
        firstName: {
            type: Sequelize.STRING,
        },
        phoneNumber: {
            type: Sequelize.STRING,
            required: true,
            unique: true
        },
        lastName: {
            type: Sequelize.STRING
        },
        username: {
            type: Sequelize.STRING
        },
        activeStatus: {
            type: Sequelize.BOOLEAN,
            default: false
        },
        roll: {
            type: Sequelize.STRING,
            required: true,
            default: "user"
        }
    });
    //TODO USer.sync just needed once to create tables, so if tables created dont need call it any more
    // await User.sync({force: true})
    return User
}
module.exports = (injectedSequelize) => {
    sequelize = injectedSequelize;
    return {
        initUserSchema
    }
};