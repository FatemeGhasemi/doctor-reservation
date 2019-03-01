const reservationSchema = require('../models/reservation')();
const officeSchema = require('../models/office')();
const utils = require('../utils/utils');
const reserveRepository = require('../repositories/reserve');
const officeRepository = require('../repositories/office')
const secretaryRepository = require('../repositories/secretary')


/**
 *
 * @param data
 * @returns {Promise<*>}
 */
const creatReservation = async (data) => {
    const counter = await counterGenerator(data.dates);
    const doctor = await officeRepository.findDoctorByOfficeId(data.officeId)
    const doctorId = doctor.id
    const doctorOffices = doctor.officeId
    const reservation = await findReservationByOfficeId(data.officeId)
    if (reservation) {
        reservationSchema.update({status: "expired"}, {returning: true, where: {id: reservation.id}})
    }
    if (doctorOffices.includes(data.officeId)) {
        const office = await officeRepository.findOfficeById(data.officeId)
        let secretaryId = office.secretaryId
        if (data.secretaryId === secretaryId)
            return reservationSchema.create({
                counter: counter,
                officeId: data.officeId,
                doctorId: doctorId,
                secretaryId: secretaryId
            })
    } else {
        throw new Error("This time is not available")
    }
};


/**
 *
 * @param reservationId
 * @param startTime
 * @returns {Promise<*>}
 */
const addStartTimeToCounter = async (reservationId, startTime) => {
    let newCounter = [];
    const reservation = await findReservationById(reservationId);
    let counter = reservation.counter
    counter.forEach(item => {
        item.forEach(i=>{
            newCounter.push(i)
        })
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
    console.log("reservation.counter", reservation.dates)
    let reserveList=
        reservation.counter.forEach(item=>{
        item.filter(i=>{
            return i !== reserveTime
        })
    });
    console.log("reserveList", reserveList);
    return reservationSchema.update({dates: reserveList}, {returning: true, where: {id: reservationId}})
};


/**
 *
 * @param officeId
 * @returns {Promise<*>}
 */
const findReservationByOfficeId = async (officeId) => {
    let validReservation = [];
    const resrvation =  await reservationSchema.findAll({where: {officeId: officeId}})
    resrvation.forEach(item =>{
        if(item.status === "valid"){
            validReservation.push(item)
        }
    })
    console.log("validReservation: ", validReservation )
    return validReservation[0]
};


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
        console.log("reservation: ",item)
            if (item.status === "valid") {
                if ( utils.isReserveTimeInDates(item.counter,reserveTime)) {
                    reservation.push(item)
                }
            }
        }
    );
    return reservation[0]
};


/**
 *
 * @param dates
 * @returns {Promise<*>}
 */
const counterGenerator = async (dates) => {
    return await utils.dayHandler(dates);
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
};