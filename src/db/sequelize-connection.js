const Sequelize = require('sequelize');

// const sequelize = new Sequelize('postgres://localhost:5432/reservation');
const init = ()=> {
    const sequelize = new Sequelize(process.env.DATABASE_NAME, null, null, {
        host: process.env.SEQUELIZE_HOST,
        port: process.env.POSTGRES_PORT
    });
    sequelize
    .authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
}