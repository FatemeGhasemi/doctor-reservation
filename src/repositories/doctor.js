const doctorSchema = require('../models/doctor')();
const userSchema = require('../models/user')();
const userRepository = require('../repositories/user');
const statusRepository = require('../repositories/status');
const categoryRepository = require('../repositories/category')


/**
 *
 * @param data
 * @returns {Promise<*>}
 */
const createDoctorUser = async (data) => {
    const user = await userRepository.findUserByPhoneNumber(data.phoneNumber)
    const userId = user.id;
    return doctorSchema.create({
        userId: userId,
        phoneNumber: data.phoneNumber,
        name: data.name,
        categoryId: data.categoryId,
        description: data.description,
        officeId: data.officeId,
        type:data.type,
        secretaryId:data.secretaryId
    })
};


/**
 *
 * @param id
 * @returns {Promise<*>}
 */
const approveAsDoctor = async (id) => {
    userSchema.update({role: "doctor"},
        {returning: true, where: {id: id}}
    );
    return doctorSchema.update(
        {status: "approve"},
        {returning: true, where: {id: id}}
    )
};


/**
 *
 * @param phoneNumber
 * @param data
 * @returns {Promise<*>}
 */
const updateDoctorData = async (phoneNumber, data) => {
    return doctorSchema.update(
        {
            name: data.name,
            categoryId: data.categoryId,
            description: data.description,
            officeId: data.officeId,
            status: data.status,
            type:data.type,
            secretaryId: data.secretaryId
        },
        {returning: true, where: {phoneNumber: phoneNumber}}
    )
};


/**
 *
 * @param id
 * @returns {Promise<*>}
 */
const deactivateDoctor = async (id) => {
    return doctorSchema.update(
        {status: "deactivate"},
        {returning: true, where: {id: id}}
    )
};


/**
 *
 * @param offset
 * @param limit
 * @returns {Promise<*>}
 */
const getAllDoctors = async (offset = 0, limit = 10) => {
    return doctorSchema.findAll(
        {offset: offset, limit: limit},
    )
}


// const searchDoctorByName = async (name) => {
//     return doctorSchema.findOne({where: {name: name}})
// }


/**
 *
 * @param categoryId
 * @returns {Promise<*>}
 */
const searchDoctorByCategory = async (categoryId) => {
    const category = await categoryRepository.findCategoryById(categoryId)
    const categoryName = category.name
    const result = await categoryRepository.findCategoryByParentName(categoryName)
    if(result.length ===0) {
        return doctorSchema.findAll({
            where: {
                categoryId: categoryId
            }
        })
    }
    else {
        throw new Error("this is not available")
    }
};


/**
 *
 * @param id
 * @returns {Promise<*>}
 */
const findDoctorById = async (id)=>{
    return doctorSchema.findOne({where: {id: id}})
}


/**
 *
 * @param phoneNumber
 * @returns {*}
 */
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
    getAllDoctors,
    findDoctorById,
    // searchDoctorByName
}