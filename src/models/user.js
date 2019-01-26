const Sequelize = require('sequelize');
let sequelize;
const initUserSchema =  () => {
    const User =  sequelize.define('user', {
        firstName: {
            type: Sequelize.STRING,
        },
        phoneNumber: {
            type: Sequelize.STRING,
            required:true

        },
        lastName: {
            type: Sequelize.STRING
        }
    });
    // await User.sync({force: true})
    return User

}
module.exports=(injectedSequelize) =>{
    sequelize = injectedSequelize
    return {
        initUserSchema
    }
};