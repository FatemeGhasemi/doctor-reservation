const Sequelize = require('sequelize');

const sequelize = new Sequelize('test', 'postgres', 'postgres', {
    dialect:'postgres',
    host: process.env.SEQUELIZE_HOST,
    port: process.env.POSTGRES_PORT,
});
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.'+process.env.DATABASE_NAME);
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
const User = sequelize.define('user', {
    firstName: {
        type: Sequelize.STRING
    },
    lastName: {
        type: Sequelize.STRING
    }
});

// force: true will drop the table if it already exists
User.sync({force: true}).then(() => {
    // Table created
    // return User.create({
    //     firstName: 'John',
    //     lastName: 'Hancock'
    // });
});