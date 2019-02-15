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

router.post('/', checkAccess.validateJwt, createReservation);
module.exports = router;