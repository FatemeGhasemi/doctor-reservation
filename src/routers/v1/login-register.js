const express = require('express');
const otpService = require('../../services/athorization/otp');
const jwtService = require('../../services/athorization/jwt');
const userRepository = require('../../repositories/user');
const otpSendLimiter = require('../../middlewares/limiter')
const router = express.Router();


/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const activationAndLogin = async (req, res) => {
    try {
        if (await otpService.isOtpValid(req.body.otp, req.body.phoneNumber)) {
            await userRepository.activateUser(req.body.phoneNumber);
            await otpService.deleteOtpCode(req.body.phoneNumber);
            const jwtCode = jwtService.jwtGenerator({phoneNumber: req.body.phoneNumber});
            res.json({message: 'success', result: jwtCode})
        } else {
            res.status(403).json({message: "un authorize"})
        }
    } catch (e) {
        console.log("loginRegisterUser ERROR: ", e.message)
    }
};


/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getOtp = async (req, res) => {
    try {
        const message = "کاربر گرامی برای فعال سازی کاربری خود در اپ‌‌سفید کد زیر را در اپلیکیشن وارد نمایید";
        const otpCode = await otpService.sendOtpHandler(req.query.phoneNumber,message)
        res.status(200).json({message: "success operation",result:otpCode})
    } catch (e) {
        console.log("getOtp ERROR: ", e.message);
        res.status(500).json({message: e.message})
    }
};

router.get('/',otpSendLimiter.otpRateLimiter, getOtp);
router.post('/', activationAndLogin);

module.exports = router;
