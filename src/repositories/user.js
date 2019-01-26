const db = require('../db/db')
let userSchemaInstance
const getUserSchema = async () => {
    if (userSchemaInstance) return userSchemaInstance
    const sequilize = await db.getInstance()
    const userSchema = require('../models/user')(sequilize);
    userSchemaInstance= userSchema.initUserSchema()
    return userSchemaInstance
}

const createUser = async (phoneNumber) => {
    const userSchema = await getUserSchema()
    return userSchema.create({phoneNumber: phoneNumber})
};


const updateUser = async (phoneNumber, data) => {
//    TODO return updated user
};


const searchUserFullText = async (filter) => {
//    TODO return  user list
};


const findUserByPhoneNumber = async (phoneNumber) => {
    const userSchema = await getUserSchema()
    return userSchema.findOne({where: {phoneNumber: phoneNumber}})
};


const activateUser = async (phoneNumber) => {
//    TODO return activated user
};


const deactivateUser = async (phoneNumber) => {
//    TODO return deactivated user
};


const addFavorite = (phoneNumber, data) => {
//    TODO return favorite data
};


const removeFavorite = (phoneNumber, data) => {
//    TODO return favorite data
};


module.exports = {
    activateUser,
    createUser,
    updateUser,
    searchUserFullText,
    deactivateUser,
    addFavorite,
    removeFavorite,
    findUserByPhoneNumber
}

