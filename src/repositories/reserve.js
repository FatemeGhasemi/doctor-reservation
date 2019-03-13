const reserveSchema = require('../models/reserve')();
const userRepository = require('../repositories/user');
const reservationRepository = require('../repositories/reservation');
const cityRepository = require('../repositories/city');
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
    const office = await officeRepository.findOfficeById(data.officeId)
    let res = []
    const reservations = await reservationRepository.findReservationByOfficeId(data.officeId)
    for (let i = 0; i < reservations.length; i++) {
        const reservation = reservations[i]
        const counter = reservation.counter
        counter.forEach(item => {
            if (item.constructor === Array) {
                item.forEach(i => {
                    if (data.reserveTime === i) {
                        res.push(reservation)
                    }
                })
            } else if (item.constructor !== Array) {
                if (data.reserveTime === item) {
                    res.push(reservation)
                }
            }
        })
    }
    const reservationData = res[0]
    await reservationRepository.deleteTimeAfterChoose(data.reserveTime,reservationData.counter,reservationData.id)

    const doctor = await doctorRepository.findDoctorByOfficeId(data.officeId)
    const user = await userRepository.findUserByPhoneNumber(data.userPhoneNumber)

    const secretaryId = office.secretaryId
    const reservationId = reservationData.id;
    if (reservationData.length !== 0) {
        return reserveSchema.create({
            doctorId: doctor.id,
            userId: user.id,
            reserveTime: data.reserveTime,
            officeId: data.officeId,
            reservationId: reservationId,
            secretaryId: secretaryId
        })
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



const findReserveByOfficeId =  async (officeId)=>{
   return reserveSchema.findAll({where: {officeId: officeId}})
}



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
const getListOfUserReserves = async (phoneNumber) => {
    let data = {}
    let result = []
    const user = await userRepository.findUserByPhoneNumber(phoneNumber);
    const userId = user.id
    const reserves = await reserveSchema.findAll({where: {userId: userId}})

    for(let i=0;i<reserves.length;i++){
        const reserveData = reserves[i]
        const doctor =await doctorRepository.findDoctorById(reserveData.doctorId)
        const office = await officeRepository.findOfficeById(reserveData.officeId)
        const city = await cityRepository.findCityById(office.cityId)
        data.doctorName = doctor.name
        data.doctorPhoneNumber = doctor.phoneNumber
        data.doctorPhoto = doctor.photoUrl
        data.officeAddress = office.address
        data.officeLat = office.lat
        data.officeLong = office.long
        data.officeCity = city.displayName
        data.officePhone = office.phoneNumber
        data.officePhotoes = office.photoUrl
        data.reserveTime =reserveData.reserveTime
        data.price = reserveData.price
        data.paymentId = reserveData.paymentId
        data.reservationId = reserveData.reservationId
        result.push(data)
    }
    return result
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
            console.log("reservation:", reservation)
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
    createReportForOfficeInSpecialPeriodOfDate,
    findReserveByOfficeId
}
