const reservationSchema = require('../models/reservation')();
const officeSchema = require('../models/office')();
const utils = require('../utils/utils');
const reserveRepository = require('../repositories/reserve');
const officeRepository = require('../repositories/office')
const secretaryRepository = require('../repositories/secretary')
const doctorRepository = require('../repositories/doctor')


/**
 * create a new reservation
 * @param data
 * @returns {Promise<*>}
 */
const creatReservation = async (data) => {
    const counter = await counterGenerator(data.dates);
    // const doctor = await officeRepository.findDoctorByOfficeId(data.officeId)
    const office = await officeRepository.findOfficeById(data.officeId)
    const doctorId = office.doctorId
    const doctor = await doctorRepository.findDoctorById(doctorId)
    const doctorOffices = doctor.officeId
    // const reservations = await findReservationByOfficeId(data.officeId)
    const existFreeReserveList = await findValidReservationCounterOfAnOfficeByOfficeId(data.officeId)
    if (existFreeReserveList.length !== 0) {
        for (let i = 0; i < existFreeReserveList.length; i++) {


            if (counter.includes(existFreeReserveList[i])) {
                counter.splice(existFreeReserveList[i], 1);
            }
        }
    }

    if (doctorOffices.includes(data.officeId)) {
        const office = await officeRepository.findOfficeById(data.officeId)
        let secretaryId = office.secretaryId
        if (counter.length !== 0) {
            return reservationSchema.create({
                counter: counter,
                officeId: data.officeId,
                doctorId: doctorId,
                secretaryId: secretaryId
            })
        }
    } else {
        throw new Error("This time is not available")


    }
}


/**
 * add new start time to counter
 * @param reservationId
 * @param startTime
 * @returns {Promise<*>}
 */
const addStartTimeToCounter = async (reservationId, startTime) => {
    let newCounter = [];
    const reservation = await findReservationById(reservationId);
    let counter = reservation.counter
    counter.forEach(item => {
        newCounter.push(item)
    })
    counter = newCounter.push(startTime)
    console.log("newCounter: ", newCounter)
    return reservationSchema.update({counter: newCounter}, {returning: true, where: {id: reservationId}})
}


/**
 *
 * @param reserveTime
 * @param reservationId
 * @returns {Promise<*>}
 */
const deleteTimeAfterChoose = async (reserveTime, reservationId) => {
    const reservation = await findReservationById(reservationId)
    let reserveList = []
    reservation.counter.forEach(items => {
        items.forEach(item => {
            if (item !== reserveTime) {
                reserveList.push(item)
            }
        })
    })
    return reservationSchema.update({counter: reserveList}, {returning: true, where: {id: reservationId}})

};

const findReservationByOfficeId = (officeId) => {
    return reservationSchema.findAll({where: {officeId: officeId}})
}


/**
 *
 * @param officeId
 * @returns {Promise<*>}
 */
const findValidReservationCounterOfAnOfficeByOfficeId = async (officeId) => {
    let validReservation = [];
    const reservations = await findReservationByOfficeId(officeId)
    if (reservations.length === 0) {
        return []
    } else {
        for (let i = 0; i < reservations.length; i++) {
            const reservation = reservations[i]
            if (reservation.status === "valid") {
                const counter = reservation.counter
                counter.forEach(item => {
                    if (item.constructor !== Array) {
                        validReservation.push(item)
                    } else if (item.constructor === Array) {
                        item.forEach(i => {
                            validReservation.push(i)
                        })
                    }
                })
            }
        }

        console.log("validReservation:", validReservation)
        return validReservation
    }
}


const returnItemsOfReservationCounterOfAnOfficeThatAreInCurrentWeek = async (officeId) => {
    let oneWeekValid = []
    const reservationCounter = await findValidReservationCounterOfAnOfficeByOfficeId(officeId)
    reservationCounter.forEach(i => {
        if (utils.ifTimeIsOneWeekLaterThanToday(i)) {
            oneWeekValid.push(i)
        }
    })
    return oneWeekValid
}


/**
 *
 * @param officeId
 * @param reserveTime
 * @returns {Promise<*>}
 */
const findReservationByOfficeIdAndTime = async (officeId, reserveTime) => {
    let reservation = []
    const reservations = await reservationSchema.findAll({where: {officeId: officeId}})
    console.log("reservations: ", reservations)
    reservations.forEach(item => {
            console.log("reservation: ", item)
            if (item.status === "valid") {
                if (utils.isReserveTimeInDates(item.counter, reserveTime)) {
                    reservation.push(item)
                }
            }
        }
    );
    return reservation[0]
};


const findReservationByOfficeIdAndDate = async (officeId, reserveDate) => {
    let reservation = []
    const reservations = await reservationSchema.findAll({where: {officeId: officeId}})
    for (let i = 0; i < reservations.length; i++) {
        let item = reservations[i]
        if (item.status === "valid") {
            if (item.counter.length !== 0) {
                const reserveList = await utils.isDateInDates(item.counter, reserveDate)
                console.log("reserveList: ", reserveList)
                reservation.push(reserveList)
            }
        }
    }
    return reservation[0]
};


/**
 *
 * @param dates
 * @returns {Promise<Array>}
 */

const counterGenerator = async (dates) => {
    let counter = []
    const date = await utils.dayHandler(dates);
    date.forEach(item => {
        if (item.constructor === Array) {
            item.forEach(i => {
                counter.push(i)
            })
        } else if (item.constructor !== Array) {
            counter.push(item)
        }
    })
    return counter
};


/**
 *
 * @param id
 * @returns {Promise<*>}
 */
const findReservationById = async (id) => {
    return await reservationSchema.findOne({returning: true, where: {id: id}})
};


/**
 *
 * @param id
 * @param data
 * @returns {Promise<*>}
 */
const updateReservationData = async (id, data) => {
    return reservationSchema.update({
            counter: data.counter,
            officeId: data.officeId,
            status: data.status,
            doctorId: data.doctorId
        }
        , {returning: true, where: {id: id}}
    )
};


module.exports = {
    findReservationById,
    creatReservation,
    updateReservationData,
    counterGenerator,
    findReservationByOfficeId,
    deleteTimeAfterChoose,
    addStartTimeToCounter,
    findReservationByOfficeIdAndTime,
    findReservationByOfficeIdAndDate,
    returnItemsOfReservationCounterOfAnOfficeThatAreInCurrentWeek,
    findValidReservationCounterOfAnOfficeByOfficeId
};
