const express = require('express');
app = express();
const userRepository = require("../../repositories/user");
const otpService = require('../../services/athorization/otp');
const jwtService = require('../../services/athorization/jwt');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
const router = express.Router();

const activationAndLogin = async (req, res) => {
    try {
        if (await otpService.isOtpValid(req.body.otp, req.body.phoneNumber)) {
            otpService.deleteOtpCode(req.body.phoneNumber);
            const jwtCode = jwtService.jwtGenerator({phoneNumber: req.body.phoneNumber});
            res.json({message: 'success', tokenType: 'Bearer', accessToken: jwtCode})
        }
        else {
            res.status(403).json({message: "un authorize"})
        }
    } catch (e) {
        console.log("loginRegisterUser ERROR: ", e.message)
    }
};


const getOtp = async (req, res) => {
    try {
        const otpCode = otpService.sendOtpHandler(req.query.phoneNumber)
        res.status(200).json({message: otpCode})
    } catch (e) {
        console.log("getOtp ERROR: ", e.message);
        res.status(500).json({message: e.message})
    }
};

router.get('/', getOtp);
router.post('/',activationAndLogin);

