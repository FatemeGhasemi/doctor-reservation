const express = require('express');
const router = express.Router();
const checkAccess = require('../../middlewares/authentication');
const reserveRepository = require('../../repositories/reserve');
const statusRepository = require('../../repositories/status');
const reservationRepository = require('../../repositories/reservation');
const datetime = require('node-datetime');


const createNewReserve = async (req, res) => {
    try {
        const reserve = await reserveRepository.creatReserve(req.body)
        res.json({message: "success operation", result: reserve})
    } catch (e) {
        res.status(500).json({message: e.message})
    }
};


const cancelReserve = async (req, res) => {
    try {
        const reserve = await reserveRepository.findReserveById(req.params.id);
        const reservationId = reserve.reservationId;
        const reservation = await reservationRepository.findReservationById(reservationId);
        const reservationTimeStamp = reservation.startTime;
        const reservationDate = reservationTimeStamp.format('m/d/Y')
        const dt = datetime.create();
        const formatted = dt.format('m/d/Y');
        if (reservationDate > formatted) {
            const reserve = await reserveRepository.cancelReserve(req.params.id)
            res.json({message: "success operation", result: reserve})
        }
    } catch (e) {
        res.status(500).json({message: "cancelReserve ERROR: " + e.message})
    }
};


const updateReserveData = async (req, res) => {
    try {
        const reserve = await reserveRepository.updateReserveData(req.params, req.body)
        res.json({message: "success operation", result: reserve})

    } catch (e) {
        res.status(500).json({message: "updateReserveData ERROR: " + e.message})
    }
};


const updateHandler = async (req, res) => {
    try {
        let result;
        if (req.query) {
            result = await updateReserveData(req, res)
        } else {
            result = await cancelReserve(req, res)
        }
        res.json({message: "success operation", result: result})

    } catch (e) {
        res.status(500).json({message: "updateReserveData ERROR: " + e.message})
    }
};


router.post('/', checkAccess.validateJwt, createNewReserve);
router.put('/:id', checkAccess.validateJwt, checkAccess.checkAccessWihPhoneNumberReserveRouter, updateHandler);

module.exports = router;