const express = require('express');
const otpService = require('../../services/athorization/otp');
const jwtService = require('../../services/athorization/jwt');
const userRepository = require('../../repositories/user');
const reserveRepository = require('../../repositories/reserve');
const cityRepository = require('../../repositories/city');
const utils = require('../../utils/utils')
const router = express.Router();


const sendUserReservesData = async (req, res) => {
    try {
        let result = []
        let data = {}
        let message = "کاربر گرامی لیست ساعت های رزرو شده ی شما در اپ سفید به شرح زیر است:";
        const reserves = await reserveRepository.getListOfUserReserves(req.query.phoneNumber)
        for (let i = 0; i < reserves.length; i++) {
            const reserve = reserves[i]
            if (utils.ifTodayIsAtLeastOneDayBefore(reserve.reserveTime)) {
                result.push(reserve)
            }
            else{
                result.push("ساعتی برای شما رزرو نشده است")
            }
        }
        data.message = message
        data.reserveData = result

        await otpService.sendOtpHandler(req.query.phoneNumber, data)
        res.status(200).json({message: "success sendUserReservesData operation", result: data})
    } catch (e) {
        console.log("sendUserReservesData ERROR: ", e.message);
        res.status(500).json({message: e.message})
    }
}

router.get('/', sendUserReservesData);
module.exports = router;