const reservationSchema = require('../models/reservation')();
const officeSchema = require('../models/office')();
const moment = require('moment')


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
}


const counterGenerator = async (timeInMinutes, officeId) => {
    const reservation = findReservationById(officeId)
    console.log(reservation.startTime.format());
    console.log(reservation.finishTime.format());
    let datetimeC = reservation.finishTime.diff(reservation.startTime, 'seconds');
    console.log(datetimeC);
    return datetimeC/(timeInMinutes*60)
};


const findReservationById = async (id) => {
    return reservationSchema.findOne({where: {id: id}})
};


const updateReservationData = async (id, data) => {
    return reservationSchema.create({
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