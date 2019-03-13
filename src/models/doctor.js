const Sequelize = require('sequelize');
let sequelize;
let Doctor;
const initDoctorSchema = () => {
    Doctor = sequelize.define('doctor', {
        userId: {
            type: Sequelize.INTEGER,
            required: true,
            foreignKey: true,
        },
        officeId: {
            type: Sequelize.ARRAY(Sequelize.INTEGER),
            required: true,
            defaultValue: []
        },
        name: {
            type: Sequelize.STRING,
            required: true
        },
        categoryId: {
            type: Sequelize.STRING,
            foreignKey: true,
            required: true
        },
        phoneNumber: {
            type: Sequelize.STRING,
            required: true,
            unique: true
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true
        },
        status: {
            type: Sequelize.STRING,
            defaultValue: "pending"
        },
        secretaryId: {
            type: Sequelize.ARRAY(Sequelize.INTEGER),
        },
        type: {
            type: Sequelize.STRING
        },
        nationalId: {
            type: Sequelize.STRING,
            allowNull: false
        },
        field: {
            type: Sequelize.STRING
        },
        grade: {
            type: Sequelize.STRING
        },
        cityId: {
            type: Sequelize.STRING
        },
        avatarUrl: {
            type: Sequelize.STRING
        },
        rate: {
            type: Sequelize.INTEGER
        },
        proprietary: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        recommendedList: {
            type: Sequelize.ARRAY(Sequelize.INTEGER),
            defaultValue: []
        },
        medicalSystemNumber: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        }


    });
    //TODO Doctor.sync just needed once to create tables, so if tables created dont need call it any more
    // await Doctor.sync({force: true})
    return Doctor
};
module.exports = (injectedSequelize) => {
    if (!injectedSequelize) {
        if (!Doctor) throw new Error('Plz define schemas by calling db.initDb(');
        return Doctor
    }
    sequelize = injectedSequelize;
    return {
        initDoctorSchema
    }
};
