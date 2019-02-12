const reservationSchema = require('../models/reservation')();
const officeSchema = require('../models/office')();
const utils = require('../utils/utils');

const creatReservation = async (data) => {
    return reservationSchema.create({
        startTime: data.startTime,
        finishTime: data.finish,
        counter: data.counter,
        officeId: data.officeId,
        doctorId: data.doctorId
    })
};


const findReservationByOfficeId = async (officeId) => {
    return reservationSchema.findOne({where: {officeId: officeId}})
};


const counterGenerator = async (timeInMinutes, officeId) => {
    const reservation = await findReservationById(officeId);
    const durationTimeInMinute = await utils.towTimeDifferenceInMinutes(reservation.finishTime, reservation.startTime);
    const numberOfVisitTime = durationTimeInMinute / timeInMinutes;
    reservationSchema.update({counter: numberOfVisitTime},
        {returning: true, where: {id: id}})
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
    findReservationByOfficeId
};