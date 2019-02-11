const reservationSchema = require('../models/reservation')();


const creatReservation = async (data) => {
    return reservationSchema.create({
        startTime: data.startTime,
        finishTime: data.finish,
        counter: data.counter,
        officeId: data.officeId
    })
};


const counterGenerator = async (time) => {
//    TODO generate time in a periodic pieces of time
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
            status: data.status
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