const express = require('express');
const router = express.Router();
const reservationRepository = require('../../repositories/reservation');
const checkAccess = require('../../middlewares/authentication');


const createReservation = async (req, res) => {
    try {
        const data = req.body
        const reservation = await reservationRepository.creatReservation(data)
        res.json({message: "success createReservation operation", result: reservation})
    } catch (e) {
        console.log("createReservation ERROR: ", e)
        res.status(500).json({message: "fail createReservation operation", result: e})
    }
}

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