const doctorSchema = require('../models/doctor')();
const userSchema = require('../models/user')();
const userRepository = require('../repositories/user');
const statusRepository = require('../repositories/status');
const categoryRepository = require('../repositories/category')


/**
 * create a doctor from a user
 * @param data
 * @returns {Promise<*>}
 */
const createDoctorUser = async (data) => {
    const user = await userRepository.findUserByPhoneNumber(data.phoneNumber)
    const userId=user.id;
    const cityId = user.cityId
    return doctorSchema.create({
        userId: userId,
        phoneNumber: data.phoneNumber,
        name: data.name,
        categoryId: data.categoryId,
        description: data.description,
        type:data.type,
        nationalId:data.nationalId,
        field:data.field,
        grade:data.grade,
        province:data.province,
        cityId:cityId,
    })
};


/**
 * admin approve a user to be a doctor
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
 * update a doctor profile data
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
 * deactivate a doctor
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
 * return all doctors from db
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
 * find a list of doctor in same category
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
 * find a doctor by his/her id
 * @param id
 * @returns {Promise<*>}
 */
const findDoctorById = async (id) => {
    return doctorSchema.findOne({where: {id: id}})
};




/**
 * find a doctor by his/her phone
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
