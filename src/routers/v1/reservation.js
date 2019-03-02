const express = require('express');
const router = express.Router();
const reservationRepository = require('../../repositories/reservation');
const officeRepository = require('../../repositories/office');
const secretaryRepository = require('../../repositories/secretary');
const doctorRepository = require('../../repositories/doctor');
const checkAccess = require('../../middlewares/authentication');


/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const createReservation = async (req, res) => {
    try {
        let result = {};
        const data = req.body
        const reservation = await reservationRepository.creatReservation(data)
        const office = await officeRepository.findOfficeById(reservation.officeId)
        const officeAddress = office.address
        const officeLatitude = office.lat
        const officeLongitude = office.long
        const officePhone = office.phoneNumber
        const doctor = await doctorRepository.findDoctorById(reservation.doctorId)
        const doctorName = doctor.name
        const doctorPhone = doctor.phoneNumber
        const doctorType = doctor.type
        const doctorPhoto = doctor.avatarUrl
        const secretary = await secretaryRepository.findSecretaryId(reservation.secretaryId)
        const secretaryName = secretary.lastName
        const secretaryPhone = secretary.phoneNumber
        result.times = reservation.counter
        result.officeAddress = officeAddress
        result.officeLatitude = officeLatitude
        result.officeLongitude = officeLongitude
        result.officePhone=officePhone
        result.doctorName = doctorName
        result.doctorPhone = doctorPhone
        result.doctorType = doctorType
        result.doctorPhoto=doctorPhoto
        result.secretaryName=secretaryName
        result.secretaryPhone=secretaryPhone

        res.json({message: "success createReservation operation", result: result})
    } catch (e) {
        console.log("createReservation ERROR: ", e)
        res.status(500).json({message: "fail createReservation operation", result: e})
    }
}


/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getListOfAvailableReserveList = async (req, res) => {
    try {
        const officeId = req.query.officeId
        const reservation = await reservationRepository.findReservationByOfficeId(officeId)
        const reserveList = reservation.counter
        res.json({message: "success getListOfAvailableReserveList operation", result: reserveList})

    } catch (e) {
        res.status(500).json({message: "fail getListOfAvailableReserveList operation", result: e})
    }
};


router.post('/', checkAccess.validateJwt, createReservation);
router.get('/', getListOfAvailableReserveList);
module.exports = router;
