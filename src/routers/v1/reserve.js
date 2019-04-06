const express = require('express');
const router = express.Router();
const checkAccess = require('../../middlewares/authentication');
const reserveRepository = require('../../repositories/reserve');
const userRepository = require('../../repositories/user');
const reservationRepository = require('../../repositories/reservation');
const doctorRepository = require('../../repositories/doctor');
const officeRepository = require('../../repositories/office');
const utils = require('../../utils/utils');
const sms = require('../../services/sms')


/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const createNewReserve = async (req, res) => {
    try {
        let result = []
        let message = "کاربر محترم اپ سفید رزرو پزشک مورد نظر شما به شرح زیر انجام شده:"
        const reserve = await reserveRepository.creatReserve(req.body)
        const doctorId = reserve.doctorId
        const doctor = await doctorRepository.findDoctorById(doctorId)
        const office = await officeRepository.findOfficeById(reserve.officeId)
        let data = {}
        data.officAddress = office.address
        data.officLat = office.lat
        data.officLong = office.long
        data.doctorName = doctor.name
        data.doctorType = doctor.type
        data.avatarUrl = doctor.avatarUrl
        data.reservaTime = req.body.reserveTime
        result.push(data)
        if (doctor.smsPackCounter >= 1) {
            await sms.send(res.locals.user.phoneNumber, {message: message, data: data})
            await doctorRepository.minusDoctorSmsPackCounter(doctorId)
        }
        res.json({message: "success createNewReserve operation", result: result})
    } catch (e) {
        console.log("Error createNewReserve ", e)
        res.status(500).json({message: createNewReserve, result: e.message})
    }
};


/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const cancelReserveByReserveId = async (req, res) => {
    try {
        const reserve = await reserveRepository.findReserveById(req.params.id);
        const reserveTime = reserve.reserveTime;
        const reservationId = reserve.reservationId;
        const ifTodayIsAtLeastOneDayBefore = utils.ifTodayIsAtLeastOneDayBefore(reserveTime)
        const doctorId = reserve.doctorId
        const doctor = await doctorRepository.findDoctorById(doctorId)
        const user = await userRepository.findUserById(reserve.userId)
        if (ifTodayIsAtLeastOneDayBefore) {
            const reserve = await reserveRepository.cancelReserve(req.params.id)
            await reservationRepository.addStartTimeToCounter(reservationId, reserveTime)
            if (doctor.smsPackCounter >= 1) {
                const message = "کاربر گرامی اپ سفید نوبت شما با اطلاعات زیر لغو شد"
                let data = {}
                data.reservaTime = reserve.reserveTime
                data.reserveId = req.params.id
                data.doctorName = doctor.name
                await sms.send(user.phoneNumber, {message: message, data: data})
            }
            let result = []
            result.push(data)


            res.json({message: "success cancelReserve operation", result: result})
        } else if (!ifTodayIsAtLeastOneDayBefore) {
            res.json({message: "too late to cancel yor reserve"})
        }
    } catch (e) {
        console.log("cancelReserve ERROR: ", e)
        res.status(500).json({message: "cancelReserve ERROR: ", result: e.message})
    }
};


const cancelReserveByUserIdAndDate = async (req, res) => {
    try {
        // const user = await userRepository.findUserByPhoneNumber(res.locals.user.phoneNumber)
        // console.log("user: ", user)

        const reserves = await reserveRepository.getListOfUserReserves(res.locals.user);
        console.log("reserves: ", reserves)
        let result = []
        for (let i = 0; i < reserves.length; i++) {
            const reserve = reserves[i]
            console.log("reserve: ", reserve)


            if (reserve.reserveTime === req.body.date) {
                const ifTodayIsAtLeastOneDayBefore = utils.ifTodayIsAtLeastOneDayBefore(reserve.reserveTime)
                if (ifTodayIsAtLeastOneDayBefore) {
                    await reserveRepository.cancelReserve(reserve.reserveId)
                    result.push(reserve)
                    if (reserve.smsPackCounter >= 1) {
                        const message = "کاربر گرامی اپ سفید نوبت شما با اطلاعات زیر لغو شد"
                        let data = {}
                        data.reservaTime = reserve.reserveTime
                        data.reserveId = req.params.id
                        data.doctorName = reserve.doctorName
                        await sms.send(user.phoneNumber, {message: message, data: data})
                    }
                } else if (!ifTodayIsAtLeastOneDayBefore) {
                    res.json({message: "too late to cancel yor reserve"})
                }
            }
        }
        res.json({message: "success cancelReserve operation", result: result})


    } catch (e) {
        console.log("cancelReserve ERROR: ", e)
        res.status(500).json({message: "cancelReserve ERROR: ", result: e.message})
    }
};


const searchByReserveDateAndCategory = async (req, res) => {
    try {
        let dataArray = []
        let result = []
        const doctors = await doctorRepository.searchDoctorByCategory(req.query.categoryId)
        for (let i = 0; i < doctors.length; i++) {
            let data = {}
            const doctor = doctors[i];
            const doctorOffices = doctor.officeId
            const doctorData = await doctorRepository.findDoctorById(doctor.id)
            for (let j = 0; j < doctorOffices.length; j++) {
                const officeId = doctorOffices[j]
                const reservations = await reservationRepository.findReservationByOfficeIdAndDate(officeId, req.query.reserveDate)
                console.log("reservations: ", reservations)
                if (reservations !== undefined) {
                    if (reservations.length !== 0) {
                        const office = await officeRepository.findOfficeById(officeId)
                        data.doctorName = doctorData.name
                        data.doctorType = doctorData.type
                        data.avatarUrl = doctorData.avatarUrl
                        data.address = office.address
                        data.latitude = office.lat
                        data.longitude = office.long
                        data.reserveAvailableTimes = reservations
                    }
                }

            }
            console.log("data: ", data)
            if (!utils.isEmpty(data)) {
                result.push(data)
            }
        }

        console.log("result: ", result)
        res.json({message: "success operation searchByReserveDateAndCategory", result: result})

    } catch (e) {
        console.log("searchByReserveDateAndCategory ERROR: ", e)
        res.status(500).json({message: "searchByReserveDateAndCategory ERROR: " + e.message})
    }
};


/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const updateReserveData = async (req, res) => {
    try {
        const reserve = await reserveRepository.updateReserveData(req.params, req.body)
        res.json({message: "success operation", result: reserve})

    } catch (e) {
        res.status(500).json({message: "updateReserveData ERROR: " + e.message})
    }
};


const findUserReserveList = async (req, res) => {
    try {
        const reserve = await reserveRepository.getListOfUserReserves(req.query.phoneNumber)
        res.json({message: "success findUserReserveList operation", result: reserve})

    } catch (e) {
        res.status(500).json({message: "findUserReserveList ERROR: " + e.message})
    }
};


const reportForReserves = async (req, res) => {
    try {
        const reserve = await reserveRepository.createReportForOfficeInSpecialPeriodOfDate(req.query.officeId)
        res.json({message: "success reportForReserves operation", result: reserve})

    } catch (e) {
        res.status(500).json({message: "reportForReserves ERROR: " + e.message})
    }
}


router.post('/', checkAccess.validateJwt, createNewReserve);
// router.put('/:id', checkAccess.validateJwt, checkAccess.checkAccessWihPhoneNumberReserveRouter, cancelReserve);
// router.put('/:reserveId', cancelReserveByReserveId);
router.put('/date', checkAccess.validateJwt, cancelReserveByUserIdAndDate);
router.get('/', searchByReserveDateAndCategory);
router.get('/userReserveList', checkAccess.validateJwt, checkAccess.checkAccess, findUserReserveList);
router.get('/reservesReport', reportForReserves);

module.exports = router;
