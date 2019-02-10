const userSchema = require('../models/user')();
const statusRepository = require('../repositories/status');


const findUserByPhoneNumber = async (phoneNumber) => {
    return userSchema.findOne({where: {phoneNumber: phoneNumber}})
};


const findUserById = async (id) => {
    return userSchema.findOne({where: {id: id}})
};


const createUser = async (phoneNumber) => {
    const status = await statusRepository.findStatusByName("pending")
    const statusId = status.id
    console.log("statusId: ",status.id)
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
    const status= await statusRepository.findStatusByName("active")
    const statusId = status.id
    return userSchema.update(
        {statusId: statusId},
        {returning: true, where: {phoneNumber: phoneNumber}}
    )
};


const deactivateUser = async (phoneNumber) => {
    const status = await statusRepository.findStatusByName("deactivate")
    const statusId = status.id
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


