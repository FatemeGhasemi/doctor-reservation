const userSchema = require('../models/user')();
const statusRepository = require('../repositories/status');


/**
 *
 * @param phoneNumber
 * @returns {Promise<*>}
 */
const findUserByPhoneNumber = async (phoneNumber) => {
    return userSchema.findOne({where: {phoneNumber: phoneNumber}})
};


/**
 *
 * @param id
 * @returns {Promise<*>}
 */
const findUserById = async (id) => {
    return userSchema.findOne({where: {id: id}})
};


/**
 *
 * @param phoneNumber
 * @returns {Promise<*>}
 */
const createUser = async (phoneNumber) => {
    return userSchema.create({phoneNumber: phoneNumber})
};


/**
 *
 * @param phoneNumber
 * @returns {Promise<*>}
 */
const createUserTobeSecretary = async (phoneNumber) => {
    return userSchema.create({phoneNumber: phoneNumber, role: "secretary", status: "active"})
};


/**
 *
 * @param phoneNumber
 * @param data
 * @returns {Promise<*>}
 */
const updateUser = async (phoneNumber, data) => {
    return userSchema.update(
        {
            firstName: data.firstName,
            lastName: data.lastName,
            avatarUrl: data.avatarUrl,
            role: data.role,
            status: data.status,
            officeId: data.officeId
        },
        {returning: true, where: {phoneNumber: phoneNumber}}
    )
};


/**
 *
 * @param phoneNumber
 * @returns {Promise<string|User.role|{type, defaultValue}|RTCDtlsRole|RTCIceRole>}
 */
const getUserRoleByPhoneNumber = async (phoneNumber) => {
    const user = await findUserByPhoneNumber(phoneNumber);
    return user.role
};


/**
 *
 * @param phoneNumber
 * @returns {Promise<*>}
 */
const activateUser = async (phoneNumber) => {

    return userSchema.update(
        {status: "active"},
        {returning: true, where: {phoneNumber: phoneNumber}}
    )
};


/**
 *
 * @param phoneNumber
 * @returns {Promise<*>}
 */
const deactivateUser = async (phoneNumber) => {
    return userSchema.update(
        {status: "deactivate"},
        {returning: true, where: {phoneNumber: phoneNumber}}
    )
};


/**
 *
 * @param offset
 * @param limit
 * @returns {Promise<*>}
 */
const getAllUsers = async (offset = 0, limit = 10) => {
    return userSchema.findAll({offset: offset, limit: limit},)
}


// const searchUserFullText = async (filter) => {
// //    TODO return  user list
// };


// const addFavorite = (phoneNumber, data) => {
// //    TODO return favorite data
// };


// const removeFavorite = (phoneNumber, data) => {
// //    TODO return favorite data
// };


module.exports = {
    activateUser,
    createUser,
    updateUser,
    deactivateUser,
    findUserByPhoneNumber,
    findUserById,
    getUserRoleByPhoneNumber,
    getAllUsers,
    createUserTobeSecretary
//     searchUserFullText,
//     addFavorite,
//     removeFavorite,
};


