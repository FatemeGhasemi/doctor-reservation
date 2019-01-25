const express = require('express');
app = express();
const doctorRepository = require("../../repositories/doctor");
const checkAdminRole = require('../../middlewares/authentication');
const otpService = require('../../services/athorization/otp');
const jwtService = require('../../services/athorization/jwt');
const redis = require('../../db/redis');


const bodyParser = require('body-parser');
app.use(bodyParser.json());
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


const createNewDoctor = async (req, res) => {
    try {
        if (await otpService.isOtpValid(req.query.otp, req.body.phoneNumber)) {
            const doctorData = await doctorRepository.createDoctorUser(
                req.body.phoneNumber,
                req.body.firstName,
                req.body.lastName,
                req.body.categoryId,
                req.body.officeId
            );
            const jwtCode = jwtService.jwtGenerator({phoneNumber: req.body.phoneNumber});
            redis.removeFromRedis(req.body.phoneNumber);
            res.json({message: 'success', tokenType: 'Bearer', accessToken: jwtCode})
        } else res.status(403).json({message: "un authorize"})
    } catch
        (e) {
        res.status(500).json({message: e.message})
    }
};


const loginDoctor = async (req, res) => {
    try {
        if (doctorRepository.searchDoctorByPhoneNumber(req.body.phoneNumber)) {
            if (await otpService.isOtpValid(req.query.otp, req.body.phoneNumber)) {
                redis.removeFromRedis(req.body.phoneNumber);
                const jwtCode = jwtService.jwtGenerator({phoneNumber: req.body.phoneNumber});
                res.json({message: 'success', tokenType: 'Bearer', accessToken: jwtCode})
            } else res.status(401).json({message: "un authorize"})
        } else res.status(403).json({message: "un authorize"})

    } catch (e) {
        console.log("loginDoctor ERROR: ", e.message);
        res.status(500).json({message: e.message})
    }
};

const getListOfDoctorsByCategory = async (req, res) => {
    try {
        const result = doctorRepository.searchDoctorByCategory(req.query.categoryId)
        res.json({message: result})
    } catch (e) {
        res.status(500).json({message: e.message})
    }
};

const getListOfDoctorsFullTextSearch = async (req, res) => {
    try {
        const result = doctorRepository.searchDoctorFullText(req.query);
        res.json({message: result})
    } catch (e) {
        res.status(500).json({message: e.message})
    }
};

const getDoctorListController = async (req, res) => {
    try {
        if (req.query.otp){
            await loginDoctor(req,res)
        }
        if(req.query.categoryId){
            await getListOfDoctorsByCategory(req,res)
        }
        else await getListOfDoctorsFullTextSearch(req,res)

    }catch (e) {
        console.log("getDoctorListController ERROR: ", e.message)
    }
};


router.post('/', createNewDoctor);
router.get('/', loginDoctor);
router.get('/', getDoctorListController);
module.exports = router;