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
        if(reservation !==undefined) {
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
            result.officeId = office.id
            result.officeAddress = officeAddress
            result.officeLatitude = officeLatitude
            result.officeLongitude = officeLongitude
            result.officePhone = officePhone
            result.doctorName = doctorName
            result.doctorPhone = doctorPhone
            result.doctorType = doctorType
            result.doctorPhoto = doctorPhoto
            result.secretaryName = secretaryName
            result.secretaryPhone = secretaryPhone

            res.json({message: "success createReservation operation", result: result})
        }
        if(reservation ===undefined){
            res.status(400).json({message: "fail createReservation operation", result: "times are not in valid"})

        }
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
const getListOfFreeTimeToReserveForAnOffice = async (req, res) => {
    try {
        const officeId = req.query.officeId
        const reservation = await reservationRepository.returnItemsOfReservationCounterOfAnOfficeThatAreInCurrentWeek(officeId)
        const reserveList = reservation
        res.json({message: "success getListOfAvailableReserveList operation", result: reserveList})

    } catch (e) {
        res.status(500).json({message: "fail getListOfAvailableReserveList operation", result: e})
    }
};


const getListOfReservedTimeToReserveForAnOffice = async (req, res) => {
    try {
        let result = []
        const officeId = req.query.officeId
        const reservation = await reservationRepository.reservedListOfOffice(officeId)
        const office = await officeRepository.findOfficeById(officeId)
        const doctor = await officeRepository.findDoctorByOfficeId(officeId)
        let data = {}
        data.officeId = office.id
        data.officeAddress = office.address
        data.officeLat = office.lat
        data.officeLong = office.long
        data.officPhoto = office.photoUrl
        data.doctorName = doctor.name
        data.doctorPhone = doctor.phoneNumber
        data.doctorPhoto = doctor.avatarUrl
        data.freeTimeForReserve = reservation
        result.push(data)
        res.json({message: "success getListOfReservedTimeToReserveForAnOffice operation", result: result})

    } catch (e) {
        res.status(500).json({message: "fail getListOfReservedTimeToReserveForAnOffice operation", result: e})
    }
};


const getListOfCancelTimeToReserveForAnOffice = async (req, res) => {
    try {
        let result = []
        const officeId = req.query.officeId
        const reservation = await reservationRepository.cancelListOfOffice(officeId)
        const office = await officeRepository.findOfficeById(officeId)
        const doctor = await officeRepository.findDoctorByOfficeId(officeId)
        let data = {}
        data.officeId = office.id
        data.officeAddress = office.address
        data.officeLat = office.lat
        data.officeLong = office.long
        data.officPhoto = office.photoUrl
        data.doctorName = doctor.name
        data.doctorPhone = doctor.phoneNumber
        data.doctorPhoto = doctor.avatarUrl
        data.cancelReserves = reservation
        result.push(data)
        res.json({message: "success getListOfCancelTimeToReserveForAnOffice operation", result: result})

    } catch (e) {
        res.status(500).json({message: "fail getListOfCancelTimeToReserveForAnOffice operation", result: e})
    }
};



const getListOfAllReserveForAnOffice = async (req, res) => {
    try {
        let result = []
        const officeId = req.query.officeId
        const cancelReservation = await reservationRepository.cancelListOfOffice(officeId)
        const freeTimeForReserve = await reservationRepository.reservedListOfOffice(officeId)

        const office = await officeRepository.findOfficeById(officeId)
        const doctor = await officeRepository.findDoctorByOfficeId(officeId)
        let data = {}
        data.officeId = office.id
        data.officeAddress = office.address
        data.officeLat = office.lat
        data.officeLong = office.long
        data.officPhoto = office.photoUrl
        data.doctorName = doctor.name
        data.doctorPhone = doctor.phoneNumber
        data.doctorPhoto = doctor.avatarUrl
        data.cancelReserves = cancelReservation
        data.freeTimeForReserve = freeTimeForReserve
        result.push(data)
        res.json({message: "success getListOfAllReserveForAnOffice operation", result: result})
    } catch (e) {
        res.status(500).json({message: "fail getListOfAllReserveForAnOffice operation", result: e})
    }
};




const reportOfReservesTimeInNumber = async (req,res)=>{
    try {
        let result = []
        const officeId = req.query.officeId
        let freeCount = [];
        let cancelCount = []
        const cancelReservation = await reservationRepository.cancelListOfOffice(officeId)

        for (let i=0;i<cancelReservation.length;i++){
            cancelCount.push(i)
        }


        const freeTimeForReserve = await reservationRepository.reservedListOfOffice(officeId)
        for (let j=0;j<freeTimeForReserve.length;j++){
            freeCount.push(j)
        }

        let numberOfAllTimeToReserve = cancelCount.length + freeCount.length

        const office = await officeRepository.findOfficeById(officeId)
        const doctor = await officeRepository.findDoctorByOfficeId(officeId)
        let data = {}
        data.officeId = office.id
        data.officeAddress = office.address
        data.officeLat = office.lat
        data.officeLong = office.long
        data.officPhoto = office.photoUrl
        data.doctorName = doctor.name
        data.doctorPhone = doctor.phoneNumber
        data.doctorPhoto = doctor.avatarUrl
        data.numberOfcancelReserves = cancelCount.length
        data.numberOfFreeTimeForReserve = freeCount.length
        data.numberOfAllReserves = numberOfAllTimeToReserve
        result.push(data)
        res.json({message: "success getListOfAllReserveForAnOffice operation", result: result})
    } catch (e) {
        res.status(500).json({message: "fail getListOfAllReserveForAnOffice operation", result: e})
    }
}


router.post('/', checkAccess.validateJwt, createReservation);
router.get('/freeTime', getListOfFreeTimeToReserveForAnOffice);
router.get('/reservedTime', getListOfReservedTimeToReserveForAnOffice);
router.get('/cancelTime', getListOfCancelTimeToReserveForAnOffice);
router.get('/numberOfCancelTime', getListOfCancelTimeToReserveForAnOffice);
router.get('/allReserveTime', getListOfAllReserveForAnOffice);
router.get('/reportOfReserveTime', reportOfReservesTimeInNumber);

module.exports = router;
