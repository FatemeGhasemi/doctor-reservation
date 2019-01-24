const Sequelize = require('sequelize');
const db = require('../db/sequelize-connection');
const userSchema = async () => {
    const sequelize = await db.init(Sequelize);
//
    const User = await sequelize.define('user', {
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
    await User.sync({force: true})

}
module.exports={userSchema}