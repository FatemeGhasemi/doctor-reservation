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
    const statusId = await statusRepository.findStatusIdByName("approve")
    return doctorSchema.update(
        {statusId: statusId},
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
            statusId: data.statusId
        },
        {returning: true, where: {phoneNumber: phoneNumber}}
    )
};


const deactivateDoctor = async (id) => {
    const statusId = await statusRepository.findStatusIdByName("deactivate")
    return doctorSchema.update(
        {status: statusId},
        {returning: true, where: {id: id}}
    )
};


const searchDoctorFullText = async (filter, begin = 0, total = 10) => {
    // return doctorSchema.findAll({
    //     where: {
    //         firstName: {[Op.iLike]: filter}, [Op.or]: [
    //             {lastName: {[Op.iLike]: filter}},
    //             {id: {[Op.gt]: 10}}
    //         ]
    //
    //
    //
    //     }
    // })
};


const searchDoctorByCategory = async (categoryId, offset = 0, limit = 10) => {
    const statusId = await statusRepository.findStatusIdByName("approved")
    return userSchema.findAll(
        {offset: offset, limit: limit},
        {where: {categoryId: categoryId, status: statusId}})
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
    searchDoctorFullText,
    searchDoctorByPhoneNumber,
}