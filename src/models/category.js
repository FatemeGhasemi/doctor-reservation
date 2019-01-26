const Sequelize = require('sequelize');
const db = require('../db/db');
const categorySchema = async () => {
    const sequelize = await db.getInstance(Sequelize);
//
    const Category = await sequelize.define('category', {
        parent: {
            type: Sequelize.STRING
        },
        name: {
            type: Sequelize.STRING
        }
    });
    await Category.sync({force: true})
}
module.exports={categorySchema};