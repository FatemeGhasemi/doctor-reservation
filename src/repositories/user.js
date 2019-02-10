const userSchema = require('../models/user')();
const statusRepository = require('../repositories/status');


const findUserByPhoneNumber = async (phoneNumber) => {
    return userSchema.findOne({where: {phoneNumber: phoneNumber}})
};


const findUserById = async (id) => {
    return userSchema.findOne({where: {id: id}})
};


const createUser = async (phoneNumber) => {
    const statusId = statusRepository.findStatusIdByName("pending")
    return userSchema.create({phoneNumber: phoneNumber,statusId:statusId})
};


const updateUser = async (phoneNumber, data) => {
    return userSchema.update(
        {
            firstName: data.firstName,
            lastName: data.lastName,
            avatarUrl: data.avatarUrl,
            role: data.role,
            statusId: data.status,
            officeId: data.officeId
        },
        {returning: true, where: {phoneNumber: phoneNumber}}
    )
};


const getUserRoleByPhoneNumber = async (phoneNumber) => {
    const user = await findUserByPhoneNumber(phoneNumber);
    return user.role
};


const activateUser = async (phoneNumber) => {
    const statusId = await statusRepository.findStatusIdByName("active")
    return userSchema.update(
        {statusId: statusId},
        {returning: true, where: {phoneNumber: phoneNumber}}
    )
};


const deactivateUser = async (phoneNumber) => {
    const statusId = await statusRepository.findStatusIdByName("deactivate")
    return userSchema.update(
        {statusId: statusId},
        {returning: true, where: {phoneNumber: phoneNumber}}
    )
};


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
    getUserRoleByPhoneNumber
//     searchUserFullText,
//     addFavorite,
//     removeFavorite,
};


