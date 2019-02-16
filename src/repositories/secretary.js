const secretarySchema = require('../models/secretary')();
const userSchema = require('../models/user')();
const userRepository = require('../repositories/user');
const statusRepository = require('../repositories/status');
const doctorRepository = require('../repositories/doctor')


const createSecretaryUser = async (data,doctorData) => {
    const doctor = await doctorRepository.searchDoctorByPhoneNumber(doctorData.phoneNumber)
    const officeId = doctor.officeId
    if(officeId.includes(data.officeId)) {
        const user = await userRepository.createUserTobeSecretary(data.phoneNumber);
        const userId = user.id;
        console.log("userId: ",userId)
        console.log("data: ",data)
        return await secretarySchema.create({
            userId: userId,
            phoneNumber: data.phoneNumber,
            firstName: data.firstName,
            lastName: data.lastName,
            officeId:data.officeId
        })
    }
};


const createSecretaryForSeeder = async (data)=>{
    const user = await userRepository.createUserTobeSecretary(data.phoneNumber);
    const userId = user.id;
    return secretarySchema.create({
        userId: userId,
        phoneNumber: data.phoneNumber,
        firstName: data.firstName,
        lastName: data.lastName,
        officeId:data.officeId
    })
}


const defineSecretaryStatus = async (phoneNumber, status) => {
    await userSchema.update({role: "secretary"},
        {returning: true, where: {phoneNumber: phoneNumber}}
    );
    return secretarySchema.update(
        {status: status},
        {returning: true, where: {phoneNumber: phoneNumber}}
    )
};


const activateSecretary = async (phoneNumber) => {
    return secretarySchema.update({status: "approved"}, {returning: true, where: {phoneNumber: phoneNumber}})
}


const findSecretaryId = async (id) => {
    return secretarySchema.findOne({where: {id: id}})
}


const updateSecretaryData = async (phoneNumber, data) => {
    return secretarySchema.update(
        {
            firstName: data.firstName,
            lastName: data.lastName,
            officeId: data.officeId
        },
        {returning: true, where: {phoneNumber: phoneNumber}}
    )
};


const approveAsSecretary = async (id) => {
    userSchema.update({role: "secretary"},
        {returning: true, where: {id: id}}
    );
    return secretarySchema.update(
        {status: "approved"},
        {returning: true, where: {id: id}}
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


const searchSecretaryByCategory = async (categoryId, offset = 0, limit = 10) => {
    return userSchema.findAll(
        {offset: offset, limit: limit},
        {where: {categoryId: categoryId, status: "approved"}})
};


const searchSecretaryByPhoneNumber = async (phoneNumber) => {
    return secretarySchema.findOne({where: {$and: [{phoneNumber: phoneNumber}, {status: "approved"}]}})
};


module.exports = {
    defineSecretaryStatus,
    updateSecretaryData,
    deactivateSecretary,
    searchSecretaryByCategory,
    createSecretaryUser,
    searchSecretaryFullText,
    searchSecretaryByPhoneNumber,
    approveAsSecretary,
    findSecretaryId,
    activateSecretary,
    createSecretaryForSeeder
}