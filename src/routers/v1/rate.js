const express = require('express');
const doctorRepository = require("../../repositories/doctor");
const rateRepository = require("../../repositories/rate");
const userRepository = require("../../repositories/user");
const checkAccess = require('../../middlewares/authentication');
const jwtHelper = require('../../services/athorization/jwt');
const router = express.Router();


const userRateDoctor = async (req, res) => {
    try {
        req.body.userId = res.locals.user.id
        const result = await rateRepository.userRateDoctor(req.body)
        res.json({message: "userRateDoctor success operation", result: result})

    } catch (e) {
        console.log("userRateDoctor error: ", e.message)
        res.status(500).json({"userRateDoctor error": e.message})
    }
}


const adminSeeListOfUsersRateDoctor = async (req, res) => {
    try {
        let result
        if (res.locals.user.role === "admin") {
            result = await rateRepository.listOfUsersRateDoctor(req.query.doctorId)
        } else {
            res.status(403).json({message: "just admin can see this list"})
        }
        res.json({message: "userRateDoctor success operation", result: result})
    } catch (e) {
        console.log("userRateDoctor error: ", e.message)
        res.status(500).json({"userRateDoctor error": e.message})
    }
}


const userSeeListOfOwnRate = async (req, res) => {
    try {
        const result = await rateRepository.listOfDoctorsUserRate(res.locals.user.id)
        res.json({message: "userSeeListOfOwnRate success operation", result: result})
    } catch (e) {
        console.log("userSeeListOfOwnRate error: ", e.message)
        res.status(500).json({"userSeeListOfOwnRate error": e.message})
    }
}


const adminSeeListOfUserRate = async (req, res) => {
    try {
        let result
        if (res.locals.user.role === "admin") {
            result = await rateRepository.listOfDoctorsUserRate(req.userId)
        } else {
            res.status(403).json({message: "just admin can see this list"})
        }
        res.json({message: "adminSeeListOfOwnRate success operation", result: result})
    } catch (e) {
        console.log("adminSeeListOfOwnRate error: ", e.message)
        res.status(500).json({"adminSeeListOfOwnRate error": e.message})
    }
}


const adminSeeListOfDoctorsRateData = async (req, res) => {
    try {
        let result
        if (res.locals.user.role === "admin") {
            result = await rateRepository.listOfAllDoctorsAndRate()
        } else {
            res.status(403).json({message: "just admin can see this list"})
        }
        res.json({message: "adminSeeListOfDoctorsRateData success operation", result: result})
    } catch (e) {
        console.log("adminSeeListOfDoctorsRateData error: ", e.message)
        res.status(500).json({"adminSeeListOfDoctorsRateData error": e.message})
    }
}


router.post('/', checkAccess.validateJwt, userRateDoctor);
router.get('/showAdminDoctorRateData', checkAccess.validateJwt, adminSeeListOfUsersRateDoctor);
router.get('/userRateData', checkAccess.validateJwt, userSeeListOfOwnRate);
router.get('/showAdminUserRate', checkAccess.validateJwt, adminSeeListOfUserRate);
router.get('/showAdminAllDoctorsRateData', checkAccess.validateJwt, adminSeeListOfDoctorsRateData);
module.exports = router;
