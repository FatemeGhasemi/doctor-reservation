const userSchema = require('../models/user')();


const findUserByPhoneNumber = async (phoneNumber) => {
    return userSchema.findOne({where: {phoneNumber: phoneNumber}})
};


const findUserById = async (id) => {
    return userSchema.findOne({where: {id: id}})
};


const createUser = async (phoneNumber) => {
    return userSchema.create({phoneNumber: phoneNumber})
};


const updateUserByAdmin = async (phoneNumber, data) => {
    return userSchema.update(
        {
            firstName: data.firstName,
            lastName: data.lastName,
            roll: data.roll,
            avatarUrl: data.avatarUrl,
            status: data.status
        },
        {returning: true, where: {phoneNumber: phoneNumber}}
    )
};

const updateUser = async (phoneNumber, data) => {
    return userSchema.update(
        {
            firstName: data.firstName,
            lastName: data.lastName,
            avatarUrl: data.avatarUrl,
            status: data.status
        },
        {returning: true, where: {phoneNumber: phoneNumber}}
    )
};


const activateUser = async (phoneNumber) => {
    return userSchema.update(
        {status: "activate", roll: "user"},
        {returning: true, where: {phoneNumber: phoneNumber}}
    )
};


const deactivateUser = async (phoneNumber) => {
    return userSchema.update(
        {status: "deactivate"},
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
    updateUserByAdmin,
    findUserById
//     searchUserFullText,
//     addFavorite,
//     removeFavorite,
};


