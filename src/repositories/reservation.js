const reservationSchema = require('../models/reservation')();
const officeSchema = require('../models/office')();


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


const counterGenerator = async (time, officeId) => {
    const reservation = findReservationById(officeId)
    let startDate = new Date('"'+reservation.startTime+'"');
    let startTimeStamp = startDate.getTime();

    let finishDate = new Date('"'+reservation.finishTime+'"');
    let finishTimeStamp = startDate.getTime();

    const timeDuration = finishTimeStamp - startTimeStamp;



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
    counterGenerator
};