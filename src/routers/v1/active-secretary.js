const express = require('express');
const secretaryRepository = require("../../repositories/secretary");
const userRepository = require("../../repositories/user");
const checkAccess = require('../../middlewares/authentication');
const jwtHelper = require('../../services/athorization/jwt');
const otpHelper = require('../../services/athorization/otp')
const router = express.Router();


const activeSecretaryAccount = async (req,res)=>{
    try {
        if (await otpHelper.isOtpValid(req.body.otp, req.params.phoneNumber)) {
            await secretaryRepository.activateSecretary(req.params.phoneNumber);
            await otpHelper.deleteOtpCode(req.body.phoneNumber);
            const jwtCode = jwtHelper.jwtGenerator({phoneNumber: req.params.phoneNumber});
            res.json({message: 'success', result: jwtCode})
        } else {
            res.status(403).json({message: "un authorize"})
        }
    } catch (e) {
        console.log("loginRegisterUser ERROR: ", e.message)
        res.status(500).json({message: e.message})

    }
}




router.put('/:phoneNumber', activeSecretaryAccount);


module.exports = router;