const doctorSchema = require('../models/doctor')();
const userSchema = require('../models/user')();


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

const activateAsDoctor = async (id) => {
    userSchema.update({roll: "doctor"},
        {returning: true, where: {id: id}}
    );
    return doctorSchema.update(
        {status: "isApproved"},
        {returning: true, where: {id: id}}
    )
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
    return doctorSchema.update(
        {status: "deactivate"},
        {returning: true, where: {id: id}}
    )
};


const searchDoctorFullText = async (filter, begin = 0, total = 10) => {
//    TODO return doctor list
};


const searchDoctorByCategory = (categoryId, offset = 0, limit = 10) => {
    return userSchema.findAll(
        {offset:offset, limit: limit},
        {where: {categoryId: categoryId, status:"isApproved"}})
};


const searchDoctorByPhoneNumber = (phoneNumber) => {
    return doctorSchema.findOne({where: {phoneNumber: phoneNumber}})
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