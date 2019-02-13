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


const deleteTimeAfterChoose = async (reserveId, reservationId) => {
    const reservation = await findReservationById(reservationId)
    const reserve = await reserveRepository.findReserveById(reserveId)
    const startTime = reserve.startTime;
    let reserveList = reservation.counter;

    if (startTime.in(reserveList)) {
        for (let i = 0; i < reserveList.length - 1; i++) {
            if (reserveList[i] === startTime) {
                reserveList = reserveList.splice(i, 1);
            }
        }
    }
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
    return reservationSchema.findOne({where: {id: id}}
        , {returning: true, where: {id: id}})
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
    findReservationByOfficeId
};