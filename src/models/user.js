const Sequelize = require('sequelize');
let sequelize;
let User;
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
        role: {
            type: Sequelize.STRING,
            defaultValue: 'user'
        },
        avatarUrl:{
            type:Sequelize.STRING
        },
         status:{
            type:Sequelize.STRING,
             defaultValue: "pending"
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