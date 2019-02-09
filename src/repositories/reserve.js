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
    try {
        const reserve = await findReserveById(id);
        const cancelStatusId = await statusRepository.findStatusIdByName("cancel")
        const reservationId = reserve.reservationId;
        const reservation = await reservationRepository.findReservationById(reservationId);
        const reservationTimeStamp = reservation.startTime;
        const reservationDate = reservationTimeStamp.format('m/d/Y')
        const dt = datetime.create();
        const formatted = dt.format('m/d/Y');
        if (reservationDate > formatted) {
            return reserveSchema.update({status: cancelStatusId},
                {returning: true, where: {id: id}})
        }
    }catch (e) {
        console.log("cancelReserve ERROR: ",e.message)
    }
}


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