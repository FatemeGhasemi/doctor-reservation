const reservationSchema = require('../models/reservation')();
const officeSchema = require('../models/office')();
const utils = require('../utils/utils');
const reserveRepository = require('../repositories/reserve');

const creatReservation = async (data, timePeriodInMinutes) => {
    const counter = await counterGenerator(timePeriodInMinutes, data.officeId);
    return reservationSchema.create({
        startTime: data.startTime,
        finishTime: data.finish,
        counter: counter,
        officeId: data.officeId,
        doctorId: data.doctorId
    })
};


const deleteTimeAfterChoose = async (reserveTime, reservationId) => {
    const reservation = await findReservationById(reservationId)
    console.log("reservation.counter",reservation.counter)
    let reserveList = reservation.counter.filter(item =>{return item !== reserveTime});
    console.log("reserveList", reserveList)

    return reservationSchema.update({counter: reserveList}, {returning: true, where: {id: reservationId}})
};


const findReservationByOfficeId = async (officeId) => {
    return reservationSchema.findOne({where: {officeId: officeId}})
};


const counterGenerator = async (timePeriodInMinutes, officeId) => {
    const reservation = await findReservationById(officeId);
    const durationTimeInMinute = await utils.towTimeDifferenceInMinutes(reservation.finishTime, reservation.startTime);
    const numberOfReserves = durationTimeInMinute / timePeriodInMinutes;
    const startString = '"' + reservation.startTime + '"';
    const listOfReserves = await utils.visitTimeGenerator(startString, numberOfReserves, timePeriodInMinutes)
    return listOfReserves;
};


const findReservationById = async (id) => {
    return reservationSchema.findOne({where: {id: id}})
};


const updateReservationData = async (id, data) => {
    return reservationSchema.update({
            startTime: data.startTime,
            finishTime: data.finish,
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
    deleteTimeAfterChoose
};