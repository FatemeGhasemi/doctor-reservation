require('dotenv').config();
// const db = require('./db/sequelize-connection');
// const userSchema = require('./models/user');
// const Sequelize = require('sequelize');
const User = require('./models/user').User

User.sync({force: true}).then(() => {

});


