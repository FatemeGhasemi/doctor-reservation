const secretarySchema = require('../models/secretary')();
const userSchema = require('../models/user')();
const userRepository = require('../repositories/user');
const statusRepository = require('../repositories/status');


const createSecretaryUser = async (data) => {
    const user = await userRepository.findUserByPhoneNumber(data.phoneNumber);
    const userId = user.id;
    return secretarySchema.create({
        userId: userId,
        phoneNumber: data.phoneNumber,
        firstName: data.firstName,
        lastName: data.lastName,
    })
};

const defineSecretaryStatus = async (phoneNumber, status) => {
    await userSchema.update({role: "secretary"},
        {returning: true, where: {phoneNumber: phoneNumber}}
    );
    return secretarySchema.update(
        {status: status},
        {returning: true, where: {phoneNumber: phoneNumber}}
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


const approveAsSecretary = async (id) => {
    userSchema.update({role: "secretary"},
        {returning: true, where: {id: id}}
    );
    const statusId = await statusRepository.findStatusIdByName("isApproved")
    return secretarySchema.update(
        {statusId: statusId},
        {returning: true, where: {id: id}}
    )
};



const deactivateSecretary = async (id) => {
    const statusId = await statusRepository.findStatusIdByName("deactivate");
    return secretarySchema.update(
        {statusId: statusId},
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


const searchSecretaryByCategory = async (categoryId, offset = 0, limit = 10) => {
    const statusId = await statusRepository.findStatusIdByName("isApproved");
    return userSchema.findAll(
        {offset: offset, limit: limit},
        {where: {categoryId: categoryId, statusId: statusId}})
};


const searchSecretaryByPhoneNumber = async (phoneNumber) => {
    const statusId = await statusRepository.findStatusIdByName("isApproved");
    return secretarySchema.findOne({where: {phoneNumber: phoneNumber, statusId: statusId}})
};


module.exports = {
    defineSecretaryStatus,
    updateSecretaryData,
    deactivateSecretary,
    searchSecretaryByCategory,
    createSecretaryUser,
    searchSecretaryFullText,
    searchSecretaryByPhoneNumber,
    approveAsSecretary
}