const db = require('../db/db')


const createUser = async (phoneNumber) => {
    const sequilize = await db.getInstance()
    const userSchema = require('../models/user')(sequilize);
    const userSchema2 = await userSchema.initUserSchema()
    const user =  userSchema2.build({phoneNumber})

    return user.save({phoneNumber: phoneNumber})
};


const updateUser = async (phoneNumber, data) => {
//    TODO return updated user
};


const searchUserFullText = async (filter) => {
//    TODO return  user list
};


const searchUserByPhoneNumber = async (phoneNumber) => {
//    TODO return  user data
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
    searchUserByPhoneNumber
}

