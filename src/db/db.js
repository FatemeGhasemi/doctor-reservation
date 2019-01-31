const Sequelize = require('sequelize');
const category = require('../models/category');
const office = require('../models/office');
const reservation = require('../models/reservation');
const doctor = require('../models/doctor');

const defineSchemas = async (sequelize) => {
    const userSchema = require('./models/user')(sequelize);
    const secretarySchema = require('./models/secretary')(sequelize);
    const reservationSchema = require('./models/reservation')(sequelize);
    const officeSchema = require('./models/office')(sequelize);
    const doctorSchema = require('./models/doctor')(sequelize);
    const categorySchema = require('./models/category')(sequelize);
    try {
        await userSchema.initUserSchema();
        await secretarySchema.initSecretarySchema();
        await doctorSchema.initDoctorSchema();
        await reservationSchema.initReservationSchema();
        await officeSchema.initOfficeSchema();
        await categorySchema.initCategorySchema();
    }catch (e) {
        console.log("defineSchemas ERROR:",e)
    }
};


let sequelize;
const createDbConnection = async ()=> {
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
    await defineSchemas(sequelize)
    return sequelize
};


const getInstance =async () =>{
    if (!sequelize){
        await  createDbConnection();
        await defineSchemas(sequelize)
    }
    return sequelize
};

const initDb = async ()=>{
    await getInstance()
}



module.exports={getInstance, initDb};