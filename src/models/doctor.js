const Sequelize = require('sequelize');
let sequelize;
let Doctor;
const initDoctorSchema =  () => {
     Doctor =  sequelize.define('doctor', {
        userId:{
            type:Sequelize.INTEGER,
            required:true,
            primaryKey:true
        },
        officeId: {
            type: Sequelize.ARRAY(Sequelize.INTEGER),
            required:true
        },
        firstName: {
            type: Sequelize.STRING,
            required:true

        },
        lastName: {
            type: Sequelize.STRING,
            required:true

        },
        categoryId: {
            type: Sequelize.STRING,
            required:true

        },
        phoneNumber: {
            type: Sequelize.STRING,
            required:true

        },
        description: {
            type: Sequelize.STRING
        },
        isApproved:{
            type:Sequelize.BOOLEAN,
            default:false,
        }

    });
    //TODO Doctor.sync just needed once to create tables, so if tables created dont need call it any more
    // await Doctor.sync({force: true})
    return Doctor
};
module.exports = (injectedSequelize) => {
    if (!injectedSequelize){
        if (!Doctor) throw new Error('Plz define schemas by calling db.initDb(')
        return Doctor
    }
    sequelize = injectedSequelize;
    return {
        initDoctorSchema
    }
};