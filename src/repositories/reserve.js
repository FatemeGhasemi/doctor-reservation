const reserveSchema = require('../models/reserve')();
const userRepository = require('../repositories/user');
const reservationRepository = require('../repositories/reservation');
const statusRepository = require('../repositories/status');
const doctorRepository = require('../repositories/doctor')
const officeRepository = require('../repositories/office')
const userSchema = require('../models/user')();
const utils = require('../utils/utils')


/**
 *
 * @param data
 * @returns {Promise<*>}
 */
const creatReserve = async (data) => {
    const reservation = await reservationRepository.findReservationByOfficeIdAndTime(data.officeId, data.reserveTime);
    const office = await officeRepository.findOfficeById(data.officeId)
    const secretaryId = office.secretaryId
    const reserveList = reservation.counter;
    const reservationId = reservation.id;
    const reserveTime = data.reserveTime;
    if (utils.isReserveTimeInDates(reserveList, reserveTime)) {
        return reserveSchema.create({
            doctorId: data.doctorId,
            userId: data.userId,
            reserveTime: data.reserveTime,
            officeId: data.officeId,
            reservationId: reservationId,
            secretaryId: secretaryId
        })
    } else {
        throw new Error("This time is not available")
    }
};


/**
 *
 * @param id
 * @param data
 * @returns {Promise<*>}
 */
const updateReserveData = async (id, data) => {
    return reserveSchema.create({
            doctorId: data.doctorId,
            userId: data.userId,
            reserveTime: data.reserveTime
        }, {returning: true, where: {id: id}}
    )
};


/**
 *
 * @param id
 * @returns {Promise<*>}
 */
const findReserveById = async (id) => {
    return await reserveSchema.findOne({returning: true, where: {id: id}})

};


/**
 *
 * @param id
 * @returns {Promise<*>}
 */
const cancelReserve = async (id) => {
    return reserveSchema.update({status: "cancel"},
        {returning: true, where: {id: id}})
};


/**
 *
 * @param phoneNumber
 * @param offset
 * @param limit
 * @returns {Promise<*>}
 */
const getListOfUserReserves = async (phoneNumber, offset = 0, limit = 10) => {
    const user = await userRepository.findUserByPhoneNumber(phoneNumber);
    const userId = user.id
    return reserveSchema.findAll({offset: offset, limit: limit},
        {where: {userId: userId}})
};


/**
 *
 * @param phoneNumber
 * @param offset
 * @param limit
 * @returns {Promise<*>}
 */
const getListOfDoctorReserves = async (phoneNumber, offset = 0, limit = 10) => {
    const doctor = await doctorRepository.searchDoctorByPhoneNumber(phoneNumber);
    const doctorId = doctor.id;
    return reserveSchema.findAll({offset: offset, limit: limit},
        {where: {doctorId: doctorId}})
};


/**
 *
 * @param phoneNumber
 * @param offset
 * @param limit
 * @returns {Promise<*>}
 */
const getListOfSecretaryReserves = async (phoneNumber, offset = 0, limit = 10) => {
    const user = await userRepository.findUserByPhoneNumber(phoneNumber);
    const userId = user.id
    return reserveSchema.findAll({offset: offset, limit: limit},
        {where: {secretaryId: userId}})
};


/**
 *
 * @param categoryId
 * @param offset
 * @param limit
 * @returns {Promise<*>}
 */
const searchDoctorByCategory = async (categoryId, offset = 0, limit = 10) => {
    return userSchema.findAll(
        {offset: offset, limit: limit},
        {where: {$and: [{categoryId: categoryId}, {status: "approved"}]}})
};


/**
 *
 * @param reserveId
 * @returns {Promise<*|Reservation.doctorId|{type, required}|Reserve.doctorId|{type, required, allowNull}|Office.doctorId>}
 */
const findDoctorByReserveId = async (reserveId) => {
    const reserve = await findReserveById(reserveId)
    return reserve.doctorId
}


const countFreeTimeToReserve = async (reservation) => {
    let count = 0;
        reservation.forEach(item => {
            count += 1
        })

    return count

};


const countCancelReserves = async (officeId) => {
    let count = 0;
    const cancelledReserves = await reserveSchema.findAll({where: {status: "cancel"}})
    if (cancelledReserves.length !== 0) {
        cancelledReserves.forEach(item => {
            if (item.officeId === officeId) {
                count += 1
            }
        })
    }
    return count
}


const countAllReservesTome = async (officeId) => {
    const countFreeTimeToReserve = await countFreeTimeToReserve(officeId)
    const countCancelReserves = await countCancelReserves(officeId)
    return countCancelReserves + countFreeTimeToReserve
}


const createReportForOfficeInSpecialPeriodOfDate = async (officeId, start, finish) => {
    const reservations = await reservationRepository.findReservationByOfficeId(officeId)
    let result = []
    if (reservations.length !== 0) {
        let data = {}
        for (let i = 0; i < reservations.length; i++) {
            const reservation = reservations[i]
            console.log("reservation:",reservation)
            if (utils.ifTime2IsBetweenTowOtherTime(start, reservation, finish)) {
                const freeTimeToReserve = await countFreeTimeToReserve(reservations)
                const countCancelReserves = await countCancelReserves(officeId)
                const countAllReserves = freeTimeToReserve + countCancelReserves
                data.freeTimeToReserve = freeTimeToReserve
                data.countCancelReserves = countCancelReserves
                data.countAllReserves = countAllReserves
            }
        }
        data.officeId = officeId
        result.push(data)
    }
    return result
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
    findDoctorByReserveId,
    createReportForOfficeInSpecialPeriodOfDate
}