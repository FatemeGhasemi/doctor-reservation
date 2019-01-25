const express = require('express');
app = express();
const otpService = require('../../services/athorization/otp');
const router = express.Router();

const getOtp = async (req, res) => {
    try {
        console.log("req: ", req);
        const otpCode = otpService.sendOtpHandler

        res.status(200).json({message: otpCode})
    } catch (e) {
        console.log("getOtp ERROR: ", e.message);
        res.status(500).json({message: e.message})
    }
};

router.get('/', getOtp);

