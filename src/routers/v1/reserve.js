const express = require('express');
const router = express.Router();
const checkAccess = require('../../middlewares/authentication');
const reserveRepository = require('../../repositories/reserve');
const statusRepository = require('../../repositories/status');
const reservationRepository = require('../../repositories/reservation');
const doctorRepository = require('../../repositories/doctor');
const officeRepository = require('../../repositories/office');
const utils = require('../../utils/utils');


/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const createNewReserve = async (req, res) => {
    try {
        const reserve = await reserveRepository.creatReserve(req.body)
        const reservationId = reserve.reservationId
        const reserveTime = reserve.reserveTime
        await reservationRepository.deleteTimeAfterChoose(reserveTime, reservationId);
        res.json({message: "success operation", result: reserve})
    } catch (e) {
        console.log("Error createNewReserve ", e)
        res.status(500).json({message: e.message})
    }
};


/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const cancelReserve = async (req, res) => {
    try {
        const reserve = await reserveRepository.findReserveById(req.params.id);
        const reserveTime = reserve.reserveTime;
        const reservationId = reserve.reservationId;
        const ifTodayIsAtLeastOneDayBefore =  utils.ifTodayIsAtLeastOneDayBefore(reserveTime)
        if (ifTodayIsAtLeastOneDayBefore) {
            const reserve = await reserveRepository.cancelReserve(req.params.id)

            await reservationRepository.addStartTimeToCounter(reservationId, reserveTime)
            res.json({message: "success operation", result: reserve})
        } else if (!ifTodayIsAtLeastOneDayBefore) {
            res.json({message: "too late to cancel yor reserve"})
        }
    } catch (e) {
        console.log("cancelReserve ERROR: ", e)
        res.status(500).json({message: "cancelReserve ERROR: " + e.message})
    }
};


const searchByReserveDateAndCategory = async (req, res) => {
    try {
        let dataArray = []
        let result  = []
        const doctors = await doctorRepository.searchDoctorByCategory(req.query.categoryId)
        for (let i=0 ;i<doctors.length;i++){
            let data = {}
            const doctor = doctors[i];
            const doctorOffices = doctor.officeId
            const doctorData = await doctorRepository.findDoctorById(doctor.id)
            for (let j=0; j<doctorOffices.length;j++){
                const officeId = doctorOffices[j]
                const reservations = await reservationRepository.findReservationByOfficeIdAndDate(officeId,req.query.reserveDate)
                console.log("reservations: ",reservations)
                if(reservations !== undefined ) {
                    if (reservations.length !== 0 ) {
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
            console.log("data: ",data)
            if (!utils.isEmpty(data)){
                result.push(data)
            }
        }

        console.log("result: ",result)
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


// const updateHandler = async (req, res) => {
//     try {
//         let result;
//         if (req.query) {
//             result = await updateReserveData(req, res)
//         } else {
//             result = await cancelReserve(req, res)
//         }
//         res.json({message: "success operation", result: result})
//
//     } catch (e) {
//         res.status(500).json({message: "updateReserveData ERROR: " + e.message})
//     }
// };


router.post('/', checkAccess.validateJwt, createNewReserve);
// router.put('/:id', checkAccess.validateJwt, checkAccess.checkAccessWihPhoneNumberReserveRouter, cancelReserve);
router.put('/:id', cancelReserve);
router.get('/', searchByReserveDateAndCategory);

module.exports = router;
