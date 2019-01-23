const Sequelize = require('sequelize');
const db = require('../db/sequelize-connection');
const categorySchema = async () => {
    const sequelize = await db.init(Sequelize);
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