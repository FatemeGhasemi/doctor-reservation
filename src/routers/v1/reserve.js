const express = require('express');
const router = express.Router();
const checkAccess = require('../../middlewares/authentication');
const reserveRepository = require('../../repositories/reserve');
const statusRepository = require('../../repositories/status');
const reservationRepository = require('../../repositories/reservation');
const utils = require('../../utils/utils');

const createNewReserve = async (req, res) => {
    try {
        const reserve = await reserveRepository.creatReserve(req.body)
        const reservationId = reserve.reservationId
        const reserveTime = reserve.reserveTime
        await reservationRepository.deleteTimeAfterChoose(reserveTime,reservationId);
        res.json({message: "success operation", result: reserve})
    } catch (e) {
        res.status(500).json({message: e.message})
    }
};


const cancelReserve = async (req, res) => {
    try {
        const reserve = await reserveRepository.findReserveById(req.params.id);
        const reserveTime = reserve.reserveTime;
        if (await utils.ifTodayIsAtLeastOneDayBefore(reserveTime)) {
            const reserve = await reserveRepository.cancelReserve(req.params.id)
            res.json({message: "success operation", result: reserve})
        } else  {
            res.json({message: "too late to cancel yor reserve", result: reserve})
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