const express = require('express');
const router = express.Router();
const reservationRepository = require('../../repositories/reservation');
const officeRepository = require('../../repositories/office');
const secretaryRepository = require('../../repositories/secretary');
const doctorRepository = require('../../repositories/doctor');
const cityRepository = require('../../repositories/city');
const checkAccess = require('../../middlewares/authentication');
const utils = require('../../utils/utils')


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
        if (reservation !== undefined) {
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
            const doctorCategoryId = doctor.categoryId
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
            result.doctorCategoryId = doctorCategoryId
            result.doctorPhone = doctorPhone
            result.doctorType = doctorType
            result.doctorPhoto = doctorPhoto
            result.secretaryName = secretaryName
            result.secretaryPhone = secretaryPhone

            res.json({message: "success createReservation operation", result: result})
        }
        if (reservation === undefined) {
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
        let valid = []
        const officeId = req.query.officeId
        const reservation = await reservationRepository.findValidReservationCounterOfAnOfficeByOfficeId(officeId)
        const office = await officeRepository.findOfficeById(officeId)
        const doctor = await officeRepository.findDoctorByOfficeId(officeId)
        const cityId = office.cityId
        const cityName = await cityRepository.findCityById(cityId)

        for (let i = 0; i < reservation.length; i++) {
            const time = reservation[i]
            if (utils.ifTime2IsBetweenTowOtherTime(req.query.start,time,req.query.finish)) {
                valid.push(reservation[i])
            }
        }
        let result = []
        let data = {}
        data.officeId = office.id
        data.officeAddress = office.address
        data.officeLat = office.lat
        data.officeLong = office.long
        data.officPhoto = office.photoUrl
        data.doctorName = doctor.name
        data.doctorPhone = doctor.phoneNumber
        data.doctorPhoto = doctor.avatarUrl
        data.cityName = cityName
        data.freeTimeData = valid
        result.push(data)

        res.json({message: "success getListOfAvailableReserveList operation", result: result})

    } catch (e) {
        res.status(500).json({message: "fail getListOfAvailableReserveList operation", result: e})
    }
};


const getListOfReservedTimeToReserveForAnOffice = async (req, res) => {
    try {
        let result = []
        let valid = []
        let reserveTime = []
        const officeId = req.query.officeId
        const reservation = await reservationRepository.reservedListOfOffice(officeId)
        console.log("reservation:",reservation)
        for (let i = 0; i < reservation.length; i++) {
            let time = reservation[i]
            reserveTime.push(time.reserveTime)
        }

        for (let j = 0; j < reserveTime.length; j++) {
            if (utils.ifTime2IsBetweenTowOtherTime(req.query.start, reserveTime[j], req.query.finish)) {
                valid.push(reserveTime[j])
            }
        }


        const office = await officeRepository.findOfficeById(officeId)
        const doctor = await officeRepository.findDoctorByOfficeId(officeId)
        const cityId = office.cityId
        const cityName = await cityRepository.findCityById(cityId)
        let data = {}
        data.officeId = office.id
        data.officeAddress = office.address
        data.officeLat = office.lat
        data.officeLong = office.long
        data.officPhoto = office.photoUrl
        data.doctorName = doctor.name
        data.doctorPhone = doctor.phoneNumber
        data.doctorPhoto = doctor.avatarUrl
        data.freeTimeForReserve = valid
        data.OfficeCity = cityName

        // reservedTimeDetails:{}
        // data.reservedTimeDetails.reserveId = reservation.reserveId
        // data.reservedTimeDetails.userIdThatReservedTime = reservation.userId
        // data.reservedTimeDetails.reserveTime = reservation.reserveTime
        // data.reservedTimeDetails.price = reservation.price
        // data.reservedTimeDetails.paymentId = reservation.paymentId


        result.push(data)
        res.json({message: "success getListOfReservedTimeToReserveForAnOffice operation", result: result})

    } catch (e) {
        res.status(500).json({message: "fail getListOfReservedTimeToReserveForAnOffice operation", result: e})
    }
};


const getListOfCancelTimeToReserveForAnOffice = async (req, res) => {
    try {
        let result = []
        let valid = []
        let reserveTime = []
        const officeId = req.query.officeId
        const reservation = await reservationRepository.cancelListOfOffice(officeId)
        for (let i = 0; i < reservation.length; i++) {
            let time = reservation[i]
            reserveTime.push(time.reserveTime)
        }

        for (let j = 0; j < reserveTime.length; j++) {
            if (utils.ifTime2IsBetweenTowOtherTime(req.query.start, reserveTime[j], req.query.finish)) {
                valid.push(reserveTime[j])
            }
        }

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
        data.cancelReserves = valid
        result.push(data)
        res.json({message: "success getListOfCancelTimeToReserveForAnOffice operation", result: result})

    } catch (e) {
        res.status(500).json({message: "fail getListOfCancelTimeToReserveForAnOffice operation", result: e})
    }
};


const reportOfReservesTimeInNumber = async (req, res) => {
    try {
        let result = []
        const officeId = req.query.officeId
        let freeCount = [];
        let cancelCount = []
        let countReservedTime = []
        const cancelReservation = await reservationRepository.cancelListOfOffice(officeId)

        for (let i = 0; i < cancelReservation.length; i++) {
            let time = cancelReservation[i].reserveTime
            if (utils.ifTime2IsBetweenTowOtherTime(req.query.start, time, req.query.finish)) {
                cancelCount.push(i)
            }
        }


        const freeTimeForReserve = await reservationRepository.reservedListOfOffice(officeId)
        for (let i = 0; i < freeTimeForReserve.length; i++) {
            let time = freeTimeForReserve[i].reserveTime
            if (utils.ifTime2IsBetweenTowOtherTime(req.query.start, time, req.query.finish)) {
                freeCount.push(i)
            }
        }

        const reservedTime = await reservationRepository.reservedListOfOffice(officeId)
        for (let i = 0; i < reservedTime.length; i++) {
            let time = reservedTime[i].reserveTime
            if (utils.ifTime2IsBetweenTowOtherTime(req.query.start, time, req.query.finish)) {
                countReservedTime.push(i)
            }
        }


        let numberOfAllTimeToReserve = cancelCount.length + freeCount.length + countReservedTime.length

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
        data.countReservedTime = countReservedTime.length
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
router.get('/reportOfReserveTime', reportOfReservesTimeInNumber);

module.exports = router;
