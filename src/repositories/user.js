const userSchema = require('../models/user')();


const findUserByPhoneNumber = async (phoneNumber) => {
    return userSchema.findOne({where: {phoneNumber: phoneNumber}})
};


const createUser = async (phoneNumber) => {
    return userSchema.create({phoneNumber: phoneNumber})

};


const updateUser = async (phoneNumber, data) => {
    return userSchema.update(
        {firstName: data.firstName, lastName: data.lastName},
        {returning: true, where: {phoneNumber: phoneNumber}}
    )
};


const activateUser = async (phoneNumber) => {
    return userSchema.update(
        {activeStatus: true},
        {returning: true, where: {phoneNumber: phoneNumber}}
    )
};


const deactivateUser = async (phoneNumber) => {
    return userSchema.update(
        {activeStatus: false},
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
    findUserByPhoneNumber
//     searchUserFullText,
//     addFavorite,
//     removeFavorite,
};


