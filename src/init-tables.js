require('dotenv').config();
const Sequelize = require('sequelize');


/**
 *
 * @param sequelize
 * @param dropTables
 * @returns {Promise<void>}
 */
const createTables = async (sequelize, dropTables = false) => {
    const userSchema = require('./models/user')(sequelize);
    const secretarySchema = require('./models/secretary')(sequelize);
    const reservationSchema = require('./models/reservation')(sequelize);
    const officeSchema = require('./models/office')(sequelize);
    const doctorSchema = require('./models/doctor')(sequelize);
    const categorySchema = require('./models/category')(sequelize);
    const statusSchema = require('./models/status')(sequelize);
    const reserveSchema = require('./models/reserve')(sequelize);
    const insuranceSchema = require('./models/insurance')(sequelize);
    const citySchema = require('./models/city')(sequelize);

    try {
        await userSchema.initUserSchema().sync({force: dropTables});
        await secretarySchema.initSecretarySchema().sync({force: dropTables});
        await doctorSchema.initDoctorSchema().sync({force: dropTables});
        await reservationSchema.initReservationSchema().sync({force: dropTables});
        await officeSchema.initOfficeSchema().sync({force: dropTables});
        await categorySchema.initCategorySchema().sync({force: dropTables});
        await statusSchema.initStatusSchema().sync({force: dropTables});
        await reserveSchema.initReserveSchema().sync({force: dropTables});
        await insuranceSchema.initInsuranceSchema().sync({force: dropTables});
        await citySchema.initCitySchema().sync({force: dropTables});
    } catch (e) {
        console.log("createTables ERROR:", e)
    }
};


/**
 *
 * @returns {Promise<*>}
 */
const init = async () => {
    sequelize = await new Sequelize(process.env.DATABASE_NAME, process.env.POSTGRES_USERNAME, process.env.POSTGRES_PASSWORD, {
        dialect: process.env.SEQUELIZE_DIALECT,
        host: process.env.SEQUELIZE_HOST,
        port: process.env.POSTGRES_PORT,
        logging: process.env.LOG_QUERIES === 'true'
    });
    sequelize.drop().then(res => {
        console.log("success drop", res)
    }).catch(
        err => {
            console.log("fail drop", err)
        }
    );

    await sequelize
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully.' + process.env.DATABASE_NAME);
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
    return sequelize
};

let sequelize;
/**
 *
 */
const initAndCreateTables=()=>{
    init().then(() => createTables(sequelize));

}
// tableSeeders.createDatabase().then()
module.exports = {init, createTables, initAndCreateTables}
