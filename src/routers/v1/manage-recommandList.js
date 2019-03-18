const express = require('express');
const otpService = require('../../services/athorization/otp');
const jwtService = require('../../services/athorization/jwt');
const doctorRepository = require('../../repositories/doctor');
const otpSendLimiter = require('../../middlewares/limiter')
const checkAccess = require('../../middlewares/authentication');

const router = express.Router();


const addToRecommandList = async (req, res) => {
    try {
        let doctorId;
        const doctor1 = await doctorRepository.searchDoctorByPhoneNumber(req.body.doctorData)
        const doctor2 = await doctorRepository.findDoctorByMedicalSystemNumber(req.body.doctorData)

        if (doctor1) {
            doctorId = doctor1.id
        }
        if (doctor2) {
            doctorId = doctor2.id
        }


        const result = await doctorRepository.addDoctorToRecommandList(req.params.phoneNumber, doctorId)
        res.json({message: "addToRecommandList operation succeed", result: result})

    } catch (e) {
        console.log("addToRecommandList ERROR: ", e.message);
        res.status(500).json({message: "addToRecommandList operation failed", result: e.message})
    }
}


const removeFromRecommandList = async (req, res) => {
    try {
        let doctorId;
        const doctor1 = await doctorRepository.searchDoctorByPhoneNumber(req.body.doctorData)
        const doctor2 = await doctorRepository.findDoctorByMedicalSystemNumber(req.body.doctorData)

        if (doctor1) {
            doctorId = doctor1.id
        }
        if (doctor2) {
            doctorId = doctor2.id
        }
        const result = await doctorRepository.removeDoctorFromRecommandList(req.params.phoneNumber, doctorId)
        res.json({message: "removeFromRecommandList operation succeed", result: result})

    } catch (e) {
        console.log("removeFromRecommandList ERROR: ", e.message);
        res.status(500).json({message: "removeFromRecommandList operation failed", result: e.message})
    }
}


const getListOfDoctorRecommands= async (req,res)=>{
    try {
        const result = await doctorRepository.getDoctorRecommandList(req.query.phoneNumber)
        console.log(result)
        res.json({message: "getListOfDoctorRecommands operation succeed",result:result})

    }catch (e) {
        console.log("getListOfDoctorRecommands ERROR: ", e.message);
        res.status(500).json({message: "getListOfDoctorRecommands operation failed",result:e.message})
    }
}


router.put('/:phoneNumber', checkAccess.validateJwt, checkAccess.checkAccess, addToRecommandList);
router.delete('/:phoneNumber', checkAccess.validateJwt, checkAccess.checkAccess, removeFromRecommandList);
router.get('/',getListOfDoctorRecommands);

module.exports = router;