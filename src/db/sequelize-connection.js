const Sequelize = require('sequelize');
// const sequelize = new Sequelize(process.env.DATABASE,null,null, {
//     host: process.env.SEQUELIZE_HOST,
//     dialect: process.env.SEQYELOZE_DIALECT,
// });
const sequelize = new Sequelize('postgres://localhost:5432/reservation');
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });