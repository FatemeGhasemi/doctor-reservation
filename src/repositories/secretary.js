const secretarySchema = require('../models/secretary')();
const userSchema = require('../models/user')();
const userRepository = require('../repositories/user');
const statusRepository = require('../repositories/status');
const doctorRepository = require('../repositories/doctor')


/**
 *
 * @param data
 * @param doctorData
 * @returns {Promise<*>}
 */
const createSecretaryUser = async (data, doctorData) => {
    let secretary;
    const doctor = await doctorRepository.searchDoctorByPhoneNumber(doctorData.phoneNumber)
    const officeId = doctor.officeId
    if (officeId.includes(data.officeId)) {
        const user = await userRepository.createUserTobeSecretary(data.phoneNumber);
        const userId = user.id;
        console.log("userId: ", userId)
        console.log("data: ", data)
        secretary = await secretarySchema.create({
            userId: userId,
            phoneNumber: data.phoneNumber,
            firstName: data.firstName,
            lastName: data.lastName,
        })
    }
    return secretary
};


/**
 *
 * @param data
 * @returns {Promise<*>}
 */
const createSecretaryForSeeder = async (data) => {
    const user = await userRepository.createUserTobeSecretary(data.phoneNumber);
    const userId = user.id;
    return secretarySchema.create({
        userId: userId,
        phoneNumber: data.phoneNumber,
        firstName: data.firstName,
        lastName: data.lastName,
    })
}


/**
 *
 * @param phoneNumber
 * @param status
 * @returns {Promise<*>}
 */
const defineSecretaryStatus = async (phoneNumber, status) => {
    await userSchema.update({role: "secretary"},
        {returning: true, where: {phoneNumber: phoneNumber}}
    );
    return secretarySchema.update(
        {status: status},
        {returning: true, where: {phoneNumber: phoneNumber}}
    )
};


/**
 *
 * @param phoneNumber
 * @returns {Promise<*>}
 */
const activateSecretary = async (phoneNumber) => {
    return secretarySchema.update({status: "approved"}, {returning: true, where: {phoneNumber: phoneNumber}})
}


/**
 *
 * @param id
 * @returns {Promise<*>}
 */
const findSecretaryId = async (id) => {
    return secretarySchema.findOne({where: {id: id}})
}


/**
 *
 * @param phoneNumber
 * @param data
 * @returns {Promise<*>}
 */
const updateSecretaryData = async (phoneNumber, data) => {
    return secretarySchema.update(
        {
            firstName: data.firstName,
            lastName: data.lastName,
            officeId: data.officeId
        },
        {returning: true, where: {phoneNumber: phoneNumber}}
    )
};


/**
 *
 * @param id
 * @returns {Promise<*>}
 */
const approveAsSecretary = async (id) => {
    userSchema.update({role: "secretary"},
        {returning: true, where: {id: id}}
    );
    return secretarySchema.update(
        {status: "approved"},
        {returning: true, where: {id: id}}
    )
};


/**
 *
 * @param id
 * @returns {Promise<*>}
 */
const deactivateSecretary = async (id) => {
    return secretarySchema.update(
        {status: "deactivate"},
        {returning: true, where: {id: id}}
    )
};




/**
 *
 * @param phoneNumber
 * @returns {Promise<*>}
 */
const searchSecretaryByPhoneNumber = async (phoneNumber) => {
    return secretarySchema.findOne({where: {phoneNumber:phoneNumber}})
};


module.exports = {
    defineSecretaryStatus,
    updateSecretaryData,
    deactivateSecretary,
    createSecretaryUser,
    searchSecretaryByPhoneNumber,
    approveAsSecretary,
    findSecretaryId,
    activateSecretary,
    createSecretaryForSeeder
}
