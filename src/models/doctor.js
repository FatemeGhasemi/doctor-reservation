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
            required: true,
            allowNull:false
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
            unique:true
        },
        field: {
            type: Sequelize.STRING
        },
        grade: {
            type: Sequelize.STRING
        },
        cityId: {
            type: Sequelize.STRING,
            allowNull:false
        },
        avatarUrl: {
            type: Sequelize.STRING
        },
        rate: {
            type: Sequelize.INTEGER
        },
        proprietary: {
            type: Sequelize.BOOLEAN
        },
        recommendedList: {
            type: Sequelize.ARRAY(Sequelize.INTEGER),
            defaultValue: []
        },
        medicalSystemNumber: {
            type: Sequelize.STRING,
            unique: true,
        },
        documentsPhotosUrl:{
            type:Sequelize.ARRAY(Sequelize.STRING),
            defaultValue:[]
        },
        smsPackCounter:{
            type:Sequelize.NUMERIC,
            defaultValue:0
        },
        gender:{
            type:Sequelize.STRING,
            allowNull:false
        },
        proprietaryAppCode:{
            type:Sequelize.STRING
        },
        creditExpiredTime:{
            type:Sequelize.STRING,
            allowNull:false

        },
        operationLicenseExpiredTime:{
            type:Sequelize.STRING
        },
        departmanType:{
            type:Sequelize.STRING
        },
        departmanName:{
            type:Sequelize.STRING
        },
        medicalCenterListOfDepartmanParts:{
            type:Sequelize.ARRAY(Sequelize.STRING)
        },
        detectionCenterListOfDepartmanParts:{
            type:Sequelize.ARRAY(Sequelize.STRING)
        },
        storeName:{
            type:Sequelize.STRING
        },
        accessAbility:{
        type:Sequelize.STRING,
            defaultValue:"isShown"
    },
        doctorCode:{
            type:Sequelize.STRING,
            unique:true,
            allowNull:false

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
