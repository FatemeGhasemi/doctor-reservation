const Sequelize = require('sequelize');
let sequelize;
let User;
const keyWord = require('../configs/keyWord');
const initUserSchema = () => {
     User = sequelize.define('user', {
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
            defaultValue: false
        },
        roll: {
            type: Sequelize.STRING,
        },
        avatarUrl:{
            type:Sequelize.STRING
        }
    });
    //TODO USer.sync just needed once to create tables, so if tables created dont need call it any more
    // await User.sync({force: true})
    return User
};
module.exports = (injectedSequelize) => {
    if (!injectedSequelize){
        if (!User) throw new Error('Plz define schemas by calling db.initDb(')
        return User
    }
    sequelize = injectedSequelize;
    return {
        initUserSchema
    }
};