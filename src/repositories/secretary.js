const secretarySchema = require('../models/secretary')();
const userSchema = require('../models/user')();
const userRepository = require('../repositories/user');


const createSecretaryUser = async (data) => {
    const user = await userRepository.findUserByPhoneNumber(data.phoneNumber)
    const userId = user.id;
    return secretarySchema.create({
        userId: userId,
        phoneNumber: data.phoneNumber,
        firstName: data.firstName,
        lastName: data.lastName,
    })
};

const activateAsSecretary = async (id) => {
    userSchema.update({role: "secretary"},
        {returning: true, where: {id: id}}
    );
    return secretarySchema.update(
        {status: "isApproved"},
        {returning: true, where: {id: id}}
    )
};


const updateSecretaryData = async (phoneNumber, data) => {
    return secretarySchema.update(
        {
            phoneNumber: phoneNumber,
            firstName: data.firstName,
            lastName: data.lastName,
            status: data.status
        },
        {returning: true, where: {phoneNumber: phoneNumber}}
    )
};


const deactivateSecretary = async (id) => {
    return secretarySchema.update(
        {status: "deactivate"},
        {returning: true, where: {id: id}}
    )
};


const searchSecretaryFullText = async (filter, begin = 0, total = 10) => {
    // return secretarySchema.findAll({
    //     where: {
    //         firstName: {[Op.iLike]: filter}, [Op.or]: [
    //             {lastName: {[Op.iLike]: filter}},
    //             {id: {[Op.gt]: 10}}
    //         ]
    //
    //
    //
    //     }
    // })
};


const searchSecretaryByCategory = (categoryId, offset = 0, limit = 10) => {
    return userSchema.findAll(
        {offset: offset, limit: limit},
        {where: {categoryId: categoryId, status: "isApproved"}})
};


const searchSecretaryByPhoneNumber = (phoneNumber) => {
    return secretarySchema.findOne({where: {phoneNumber: phoneNumber}})
};


module.exports = {
    activateAsSecretary,
    updateSecretaryData,
    deactivateSecretary,
    searchSecretaryByCategory,
    createSecretaryUser,
    searchSecretaryFullText,
    searchSecretaryByPhoneNumber,
}