const reserveSchema = require('../models/reserve')();
const userRepository = require('../repositories/user');
const reservationRepository = require('../repositories/reservation');
const statusRepository = require('../repositories/status');
const doctorRepository = require('../repositories/doctor')
const officeRepository = require('../repositories/office')
const userSchema = require('../models/user')();
const utils = require('../utils/utils')


const creatReserve = async (data) => {
    const reservation = await reservationRepository.findReservationByOfficeIdAndTime(data.officeId,data.reserveTime);
    const office = await officeRepository.findOfficeById(data.officeId)
    const secretaryId = office.secretaryId
    const reserveList = reservation.counter;
    const reservationId = reservation.id;
    const reserveTime = data.reserveTime;
    if (utils.isReserveTimeInDates(reserveList,reserveTime)) {
        return reserveSchema.create({
            doctorId: data.doctorId,
            userId: data.userId,
            reserveTime: data.reserveTime,
            officeId: data.officeId,
            reservationId: reservationId,
            secretaryId:secretaryId
        })
    } else {
        throw new Error("This time is not available")
    }
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
    return await reserveSchema.findOne ({returning: true, where: {id: id}})

};


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


const findDoctorByReserveId = async (reserveId) => {
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