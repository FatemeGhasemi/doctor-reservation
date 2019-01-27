require('dotenv').config();

const db = require('../db/db')
let userSchemaInstance;

const getUserSchema = async () => {
    if (userSchemaInstance) return userSchemaInstance;
    const sequelize = await db.getInstance();
    const userSchema = require('../models/user')(sequelize);
    userSchemaInstance = userSchema.initUserSchema();
    return userSchemaInstance
};


const findUserByPhoneNumber = async (phoneNumber) => {
    const userSchema = await getUserSchema();
    return userSchema.findOne({where: {phoneNumber: phoneNumber}})
};


const createUser = async (phoneNumber) => {
    const userSchema = await getUserSchema();
    return userSchema.create({phoneNumber: phoneNumber})

};


const updateUser = async (phoneNumber, data) => {
    const userSchema = await getUserSchema();
    return userSchema.update(
        {firstName: data.firstName, lastName: data.lastName},
        {returning: true, where: {phoneNumber: phoneNumber}}
    )
};


const activateUser = async (phoneNumber) => {
    const userSchema = await getUserSchema();
    return userSchema.update(
        {activeStatus: true},
        {returning: true, where: {phoneNumber: phoneNumber}}
    )
};


const deactivateUser = async (phoneNumber) => {
    const userSchema = await getUserSchema();
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


