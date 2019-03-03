// const Sequelize = require('sequelize');
//
// const sequelize = new Sequelize('test', 'postgres', 'postgres', {
//     dialect:'postgres',
//     host:'localhost',
//     port: 5431,
// });
// sequelize
//     .authenticate()
//     .then(() => {
//         console.log('Connection has been established successfully.');
//     })
//     .catch(err => {
//         console.error('Unable to connect to the database:', err);
//     });
// const User = sequelize.define('user', {
//     firstName: {
//         type: Sequelize.STRING
//     },
//     lastName: {
//         type: Sequelize.STRING
//     }
// });
// const City = sequelize.define('city', { countryCode: Sequelize.STRING });
// const Country = sequelize.define('country', { isoCode: Sequelize.STRING });

// Here we can connect countries and cities base on country code
// Country.hasMany(City, {foreignKey: 'countryCode', sourceKey: 'isoCode'});
// City.belongsTo(Country, {foreignKey: 'countryCode', targetKey: 'isoCode'});
// force: true will drop the table if it already exists
// City.sync({force: true}).then(() => {
    // Table created
    // return User.create({
    //     firstName: 'John',
    //     lastName: 'Hancock'
    // });
// });
// Country.sync({force: true}).then(() => {
    // Table created
    // return User.create({
    //     firstName: 'John',
    //     lastName: 'Hancock'
    // });
// });
let y = [[1,2,3],[4,5]]
console.log(y)
y.contains(7)
