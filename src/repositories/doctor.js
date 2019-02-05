const doctorSchema = require('../models/doctor')();
const userSchema = require('../models/user')();


const createDoctorUser = async (data) => {
    return doctorSchema.create({
        phoneNumber: data.phoneNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        categoryId: data.categoryId,
        description: data.description,
        officeIds: data.officeIds
    })
};


const activateAsDoctor = async (id) => {
    userSchema.update({role: "doctor"},
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
            officeIds: data.officeIds,
            status: data.status
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


const searchDoctorByCategory = (categoryId, offset = 0, limit = 10) => {
    return userSchema.findAll(
        {offset: offset, limit: limit},
        {where: {categoryId: categoryId, status: "isApproved"}})
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
    searchDoctorByPhoneNumber,
}