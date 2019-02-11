const doctorSchema = require('../models/doctor')();
const userSchema = require('../models/user')();
const userRepository = require('../repositories/user');
const statusRepository = require('../repositories/status');


const createDoctorUser = async (data) => {
    const user = await userRepository.findUserByPhoneNumber(data.phoneNumber)
    const userId = user.id;
    return doctorSchema.create({
        userId: userId,
        phoneNumber: data.phoneNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        categoryId: data.categoryId,
        description: data.description,
        officeId: data.officeId
    })
};

const approveAsDoctor = async (id) => {
    userSchema.update({role: "doctor"},
        {returning: true, where: {id: id}}
    );
    return doctorSchema.update(
        {status: "approve"},
        {returning: true, where: {id: id}}
    )
};


const updateDoctorData = async (phoneNumber, data) => {
    return doctorSchema.update(
        {
            firstName: data.firstName,
            lastName: data.lastName,
            categoryId: data.categoryId,
            description: data.description,
            officeId: data.officeId,
            status: data.status
        },
        {returning: true, where: {phoneNumber: phoneNumber}}
    )
};


const deactivateDoctor = async (id) => {
    return doctorSchema.update(
        {status: "deactivate"},
        {returning: true, where: {id: id}}
    )
};


const getAllDoctors = async (offset = 0, limit = 10)=>{
    return doctorSchema.findAll(
        {offset: offset, limit: limit},
        )
}


const searchDoctorByName = async (name)=>{}

const searchDoctorByCategory = async (categoryId, offset = 0, limit = 10) => {
    return doctorSchema.findAll(
        {offset: offset, limit: limit},
        {where: {$and:[{categoryId: categoryId},{status:"approved"}]}
        })
};


const searchDoctorByPhoneNumber = (phoneNumber) => {
    return doctorSchema.findOne({where: {phoneNumber: phoneNumber}})
};


module.exports = {
    approveAsDoctor,
    updateDoctorData,
    deactivateDoctor,
    searchDoctorByCategory,
    createDoctorUser,
    searchDoctorByPhoneNumber,
    getAllDoctors
}