const express = require('express');
const otpService = require('../../services/athorization/otp');
const jwtService = require('../../services/athorization/jwt');
const doctorRepository = require('../../repositories/doctor');
const otpSendLimiter = require('../../middlewares/limiter')
const checkAccess = require('../../middlewares/authentication');

const router = express.Router();



const requestToBeProprietaryDoctor = async (req,res)=>{
    try {
        const result = await doctorRepository.sendProprietaryRequest(res.locals.user.phoneNumber)
        res.json({message: "requestToBeProprietaryDoctor operation succeed", result: result})
    }catch (e) {
        console.log("requestToBeProprietaryDoctor ERROR: ", e.message);
        res.status(500).json({message: "requestToBeProprietaryDoctor operation failed", result: e.message})
    }
}


const acceptToBeProprietaryDoctor = async (req,res)=>{
    try {
        const result = await doctorRepository.acceptToBeProprietary(req.params.phoneNumber)
        res.json({message: "acceptToBeProprietaryDoctor operation succeed", result: result})
    }catch (e) {
        console.log("acceptToBeProprietaryDoctor ERROR: ", e.message);
        res.status(500).json({message: "acceptToBeProprietaryDoctor operation failed", result: e.message})
    }
}


const getListOfPendingTobeProprietaryDoctor =  async (req,res)=>{
    try {
        const result = await doctorRepository.listOfPendingTobeProprietaryDoctor()
        res.json({message: "getListOfPendingTobeProprietaryDoctor operation succeed", result: result})
    }catch (e) {
        console.log("getListOfPendingTobeProprietaryDoctor ERROR: ", e.message);
        res.status(500).json({message: "getListOfPendingTobeProprietaryDoctor operation failed", result: e.message})
    }
}




const addToRecommandList = async (req, res) => {
    try {
        const parentDoctor = await doctorRepository.searchDoctorByPhoneNumber(res.locals.user.phoneNumber)
        if(parentDoctor.proprietary) {
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
        }else {
            res.json({message: "doctor should approved as a proprietary first"})

        }

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


router.put('/:phoneNumber', checkAccess.validateJwt, addToRecommandList);
router.delete('/:phoneNumber', checkAccess.validateJwt, removeFromRecommandList);
router.get('/',getListOfDoctorRecommands);


module.exports = router;