const reserveSchema = require('../models/reserve')();
const userRepository = require('../repositories/user');
const reservationRepository = require('../repositories/reservation');
const datetime = require('node-datetime');
const statusRepository = require('../repositories/status');
const doctorRepository = require('../repositories/doctor')
const userSchema = require('../models/user')();


const creatReserve = async (data) => {
    const reserawait reservationRepository.findReservationByOfficeId(data.officeId)
    return reserveSchema.create({
        doctorId: data.doctorId,
        userId: data.userId,
        reserveTime: data.reserveTime
    })
};


const updateReserveData = async (id, data) => {
    return reserveSchema.create({
            doctorId: data.doctorId,
            userId: data.userId,
            reserveTime: data.reserveTime
        }, {returning: true, where: {id: id}}
    )
};


const findReserveById = async (id) => {
    return reserveSchema.findOne({where: {id: id}})
}


const cancelReserve = async (id) => {
    return reserveSchema.update({status: "cancel"},
        {returning: true, where: {id: id}})
};


const getListOfUserReserves = async (phoneNumber, offset = 0, limit = 10) => {
    const user = await userRepository.findUserByPhoneNumber(phoneNumber);
    const userId = user.id
    return reserveSchema.findAll({offset: offset, limit: limit},
        {where: {userId: userId}})
};

const getListOfDoctorReserves = async (phoneNumber, offset = 0, limit = 10) => {
    const doctor = await doctorRepository.searchDoctorByPhoneNumber(phoneNumber);
    const doctorId = doctor.id;
    return reserveSchema.findAll({offset: offset, limit: limit},
        {where: {doctorId: doctorId}})
};


const getListOfSecretaryReserves = async (phoneNumber, offset = 0, limit = 10) => {
    const user = await userRepository.findUserByPhoneNumber(phoneNumber);
    const userId = user.id
    return reserveSchema.findAll({offset: offset, limit: limit},
        {where: {secretaryId: userId}})
};


const searchDoctorByCategory = async (categoryId, offset = 0, limit = 10) => {
    return userSchema.findAll(
        {offset: offset, limit: limit},
        {where: {$and: [{categoryId: categoryId}, {status: "approved"}]}})
};


const findDoctorByReserveId = async (reserveId)=>{
    const reserve = await findReserveById(reserveId)
    return reserve.doctorId
}




module.exports = {
    creatReserve,
    searchDoctorByCategory,
    getListOfDoctorReserves,
    getListOfSecretaryReserves,
    getListOfUserReserves,
    updateReserveData,
    cancelReserve,
    findReserveById,
    findDoctorByReserveId
}