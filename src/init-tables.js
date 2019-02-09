require('dotenv').config();
const Sequelize = require('sequelize');
const createTables = async (sequelize) => {
    const userSchema = require('./models/user')(sequelize);
    const secretarySchema = require('./models/secretary')(sequelize);
    const reservationSchema = require('./models/reservation')(sequelize);
    const officeSchema = require('./models/office')(sequelize);
    const doctorSchema = require('./models/doctor')(sequelize);
    const categorySchema = require('./models/category')(sequelize);
    const statusSchema = require('./models/status')(sequelize);
    const reserveSchema = require('./models/reserve')(sequelize);


    try {
        await userSchema.initUserSchema().sync();
        await secretarySchema.initSecretarySchema().sync();
        await doctorSchema.initDoctorSchema().sync();
        await reservationSchema.initReservationSchema().sync();
        await officeSchema.initOfficeSchema().sync();
        await categorySchema.initCategorySchema().sync();
        await statusSchema.initStatusSchema().sync();
        await reserveSchema.initReserveSchema().sync();
    }catch (e) {
        console.log("createTables ERROR:",e)
    }
};


const init = async ()=> {
    sequelize = await new Sequelize(process.env.DATABASE_NAME, process.env.POSTGRES_USERNAME, process.env.POSTGRES_PASSWORD, {
        dialect:process.env.SEQUELIZE_DIALECT,
        host: process.env.SEQUELIZE_HOST,
        port: process.env.POSTGRES_PORT,
    });
    await sequelize
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully.'+process.env.DATABASE_NAME);
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
    return sequelize
};

let sequelize;
init().then(()=>createTables(sequelize));


module.exports = {init,createTables}