const reserveSchema = require('../models/reserve')();
const userRepository = require('../repositories/user');
const reservationRepository = require('../repositories/reservation');
const datetime = require('node-datetime');
const statusRepository = require('../repositories/status');

const creatReserve = async (data) => {
    return reserveSchema.create({
        secretaryId: data.secretaryId,
        doctorId: data.doctorId,
        userId: data.userId,
        reservationId: data.reservationId
    })
};


const updateReserveData = async (id, data) => {
    return reserveSchema.create({
            secretaryId: data.secretaryId,
            doctorId: data.doctorId,
            userId: data.userId,
            reservationId: data.reservationId
        }, {returning: true, where: {id: id}}
    )
};


const findReserveById = async (id) => {
    return reserveSchema.findOne({where: {id: id}})
}


const cancelReserve = async (id) => {
    const cancelStatusId = await statusRepository.findStatusIdByName("cancel")
    return reserveSchema.update({status: cancelStatusId},
        {returning: true, where: {id: id}})
};


const getListOfUserReserves = async (phoneNumber, offset = 0, limit = 10) => {
    const user = await userRepository.findUserByPhoneNumber(phoneNumber);
    const userId = user.id
    return reserveSchema.findAll({offset: offset, limit: limit},
        {where: {userId: userId}})
};

const getListOfDoctorReserves = async (phoneNumber, offset = 0, limit = 10) => {
    const user = await userRepository.findUserByPhoneNumber(phoneNumber);
    const userId = user.id;
    return reserveSchema.findAll({offset: offset, limit: limit},
        {where: {doctorId: userId}})
};


const getListOfSecretaryReserves = async (phoneNumber, offset = 0, limit = 10) => {
    const user = await userRepository.findUserByPhoneNumber(phoneNumber);
    const userId = user.id
    return reserveSchema.findAll({offset: offset, limit: limit},
        {where: {secretaryId: userId}})
};


const searchDoctorByCategory = async (categoryId, offset = 0, limit = 10) => {
    const statusId = await statusRepository.findStatusIdByName("approved")
    return userSchema.findAll(
        {offset: offset, limit: limit},
        {where: {categoryId: categoryId, status: statusId}})
};


module.exports = {
    creatReserve,
    searchDoctorByCategory,
    getListOfDoctorReserves,
    getListOfSecretaryReserves,
    getListOfUserReserves,
    updateReserveData,
    cancelReserve,
    findReserveById
}