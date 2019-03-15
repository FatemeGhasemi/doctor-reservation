const express = require('express');
const sms = require('../../services/sms');
const jwtService = require('../../services/athorization/jwt');
const doctorRepository = require('../../repositories/doctor');
const reserveRepository = require('../../repositories/reserve');
const billingRepository = require('../../repositories/billing');
const utils = require('../../utils/utils')
const checkAccess = require('../../middlewares/authentication');
const router = express.Router();


const chargePacketSmsCounterOfDoctor = async (req, res) => {
    try {
        const result = await billingRepository.chargeSmsPackCounter(res.locals.user.phoneNumber)
        console.log("result: ",result)
        res.json({message: "chargeSmsPackCounter operation success", result: result})
    } catch (e) {
        console.log("chargePacketSmsCounterOfDoctor ERROR: ", e)
        res.json({message: "chargePacketSmsCounterOfDoctor operation fail", result: e.message})
    }
};


router.put('/', checkAccess.validateJwt, chargePacketSmsCounterOfDoctor);
module.exports = router;