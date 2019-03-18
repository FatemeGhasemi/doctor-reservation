const express = require('express');
const otpService = require('../../services/athorization/otp');
const jwtService = require('../../services/athorization/jwt');
const doctorRepository = require('../../repositories/doctor');
const userRepository = require('../../repositories/user');
const otpSendLimiter = require('../../middlewares/limiter')
const checkAccess = require('../../middlewares/authentication');

const router = express.Router();


const requestToBeProprietaryDoctor = async (req, res) => {
    try {
        const result = await doctorRepository.sendProprietaryRequest(res.locals.user.phoneNumber)
        res.json({message: "requestToBeProprietaryDoctor operation succeed", result: result})
    } catch (e) {
        console.log("requestToBeProprietaryDoctor ERROR: ", e.message);
        res.status(500).json({message: "requestToBeProprietaryDoctor operation failed", result: e.message})
    }
}


const acceptToBeProprietaryDoctor = async (req, res) => {
    try {
        const result = await doctorRepository.acceptToBeProprietary(req.params.phoneNumber)
        res.json({message: "acceptToBeProprietaryDoctor operation succeed", result: result})
    } catch (e) {
        console.log("acceptToBeProprietaryDoctor ERROR: ", e.message);
        res.status(500).json({message: "acceptToBeProprietaryDoctor operation failed", result: e.message})
    }
}


const rejectToBeProprietaryDoctor = async (req, res) => {
    try {
        const result = await doctorRepository.rejectToBeProprietary(req.params.phoneNumber)
        res.json({message: "rejectToBeProprietary operation succeed", result: result})
    } catch (e) {
        console.log("rejectToBeProprietary ERROR: ", e.message);
        res.status(500).json({message: "rejectToBeProprietary operation failed", result: e.message})
    }
}


const getListOfPendingTobeProprietaryDoctor = async (req, res) => {
    try {
        const result = await doctorRepository.listOfPendingTobeProprietaryDoctor()
        res.json({message: "getListOfPendingTobeProprietaryDoctor operation succeed", result: result})
    } catch (e) {
        console.log("getListOfPendingTobeProprietaryDoctor ERROR: ", e.message);
        res.status(500).json({message: "getListOfPendingTobeProprietaryDoctor operation failed", result: e.message})
    }
}

const getListOfRejectTobeProprietaryDoctor = async (req, res) => {
    try {
        const result = await doctorRepository.listOfRejectTobeProprietaryDoctor()
        res.json({message: "getListOfRejectTobeProprietaryDoctor operation succeed", result: result})
    } catch (e) {
        console.log("getListOfRejectTobeProprietaryDoctor ERROR: ", e.message);
        res.status(500).json({message: "getListOfRejectTobeProprietaryDoctor operation failed", result: e.message})
    }
}


const getListOfAcceptTobeProprietaryDoctor = async (req, res) => {
    try {
        const result = await doctorRepository.listOfApprovedTobeProprietaryDoctor()
        res.json({message: "getListOfAcceptTobeProprietaryDoctor operation succeed", result: result})
    } catch (e) {
        console.log("getListOfAcceptTobeProprietaryDoctor ERROR: ", e.message);
        res.status(500).json({message: "getListOfAcceptTobeProprietaryDoctor operation failed", result: e.message})
    }
}


const ShowUserOwnProprietaryAppList = async (req, res) => {
    try {
        const result = await userRepository.getListOfUserProprietaryAppList(res.locals.user.phoneNumber)
        res.json({message: "ShowUserOwnProprietaryAppList operation succeed", result: result})
    } catch (e) {
        console.log("ShowUserOwnProprietaryAppList ERROR: ", e.message);
        res.status(500).json({message: "ShowUserOwnProprietaryAppList operation failed", result: e.message})
    }
}


const addDoctorToUserProprietaryAppList = async (req, res) => {
    try {
        const result = await userRepository.addDoctorToProprietaryAppList(req.query.doctorProprietaryCode, res.locals.user.phoneNumber)
        res.json({message: "addDoctorToUserProprietaryAppList operation succeed", result: result})
    } catch (e) {
        console.log("addDoctorToUserProprietaryAppList ERROR: ", e.message);
        res.status(500).json({message: "addDoctorToUserProprietaryAppList operation failed", result: e.message})
    }
}

router.put('/addDoctorToUserProprietaryAppList',checkAccess.validateJwt,addDoctorToUserProprietaryAppList)
router.get('/ShowUserOwnProprietaryAppList', checkAccess.validateJwt, ShowUserOwnProprietaryAppList)
router.get('/pending', checkAccess.validateJwt, checkAccess.checkRolesAccess, getListOfPendingTobeProprietaryDoctor);
router.get('/approved', checkAccess.validateJwt, checkAccess.checkRolesAccess, getListOfAcceptTobeProprietaryDoctor);
router.get('/rejected', checkAccess.validateJwt, checkAccess.checkRolesAccess, getListOfRejectTobeProprietaryDoctor);
router.post('/sendRequest', checkAccess.validateJwt, checkAccess.checkRolesAccess, requestToBeProprietaryDoctor);
router.put('/acceptToBeProprietary/:phoneNumber', checkAccess.validateJwt, checkAccess.checkRolesAccess, acceptToBeProprietaryDoctor);
router.put('/rejectToBeProprietary/:phoneNumber', checkAccess.validateJwt, checkAccess.checkRolesAccess, rejectToBeProprietaryDoctor);
module.exports = router;