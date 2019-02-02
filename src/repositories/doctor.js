const doctorSchema = require('../models/doctor')();


const findUserByPhoneNumber = async (phoneNumber) => {
    return userSchema.findOne({where: {phoneNumber: phoneNumber}})
};


const updateUserByAdmin = async (phoneNumber, data) => {
    return userSchema.update(
        {firstName: data.firstName, lastName: data.lastName, roll: data.roll, avatarUrl: data.avatarUrl},
        {returning: true, where: {phoneNumber: phoneNumber}}
    )
};

const updateUser = async (phoneNumber, data) => {
    return userSchema.update(
        {firstName: data.firstName, lastName: data.lastName},
        {returning: true, where: {phoneNumber: phoneNumber}}
    )
};


const activateUser = async (phoneNumber) => {
    return userSchema.update(
        {activeStatus: true, roll: "user"},
        {returning: true, where: {phoneNumber: phoneNumber}}
    )
};


const deactivateUser = async (phoneNumber) => {
    return userSchema.update(
        {activeStatus: false},
        {returning: true, where: {phoneNumber: phoneNumber}}
    )
};


const activateAsDoctor = async (id, officeId,) => {
//TODO should return activate doctor data
};


const updateDoctorData = async (id, data) => {
    return doctorSchema.update(
        {
            firstName: data.firstName,
            lastName: data.lastName,
            categoryId: data.categoryId,
            description: data.description,
            officeIds: data.officeIds
        },
        {returning: true, where: {id: id}}
    )
};


const deactivateDoctor = async (id) => {
//    TODO return deactivated user
};


const searchDoctorFullText = async (filter, begin = 0, total = 10) => {
//    TODO return doctor list
};


const searchDoctorByCategory = (categoryId, begin = 0, total = 10) => {
//    TODO return doctor list
}


const searchDoctorByPhoneNumber = (phoneNumber) => {
//    TODO return doctor data
}


const createDoctorUser = async (phoneNumber, firstName, lastName, categoryId, description = "", officeIds = []) => {
    return doctorSchema.create({
        phoneNumber: phoneNumber,
        firstName: firstName,
        lastName: lastName,
        categoryId: categoryId,
        description: description,
        officeIds: officeIds
    })
};

module.exports = {
    activateAsDoctor,
    updateDoctorData,
    deactivateDoctor,
    searchDoctorByCategory,
    createDoctorUser,
    searchDoctorFullText,
    searchDoctorByPhoneNumber
}