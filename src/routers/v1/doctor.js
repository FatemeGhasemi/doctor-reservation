const express = require('express');
const doctorRepository = require("../../repositories/doctor");
const userRepository = require("../../repositories/user");
const checkAccess = require('../../middlewares/authentication');
const jwtHelper = require('../../services/athorization/jwt');
const router = express.Router();


const createUserAsDoctor = async (req, res) => {
    try {
        const user = await doctorRepository.createDoctorUser(req.body);
        res.json({message: "success operation", result: user})
    } catch (e) {
        res.status(500).json({message: e.message})
    }
};

const getListOfDoctorsByCategory = async (req, res) => {
    try {
        const result = doctorRepository.searchDoctorByCategory(req.query.categoryId, req.query.offset, req.query.limit)
        res.json({message: "success operation", result: result})
    } catch (e) {
        res.status(500).json({message: e.message})
    }
};


const getListOfDoctorsFullTextSearch = async (req, res) => {
    try {
        const result = doctorRepository.searchDoctorFullText(req.query.filter, req.query.offset, req.query.limit);
        res.json({message: "success operation", result: result})
    } catch (e) {
        res.status(500).json({message: e.message})
    }
};


const getDoctorListController = async (req, res) => {
    try {
        if (req.query.categoryId) {
            await getListOfDoctorsByCategory(req, res)
        }
        else if (!req.query)
            {await getListOfDoctorsFullTextSearch(req, res)}

            } catch (e) {
        console.log("getDoctorListController ERROR: ", e.message)
    }
};


const updateDoctorData = async (req, res) => {
    try {
        console.log("hi to update")
        const data = req.body;
        const accessToken = jwtHelper.removeBearer(req.header('Authorization'));
        const phone = jwtHelper.verifyJwt(accessToken).phoneNumber;
        const role = await userRepository.getUserRoleByPhoneNumber(phone);
        if (role === "doctor") {
            delete data['status']

        }
        const user = await doctorRepository.updateDoctorData(req.params.phoneNumber, data);
        res.json({message: "success operation", result: user})

    } catch (e) {
        res.status(500).json({message: e.message})
    }
};


router.get('/', getDoctorListController);
router.post('/', checkAccess.validateJwt, checkAccess.checkRolesAccess, createUserAsDoctor);
router.put('/:phoneNumber', checkAccess.validateJwt, checkAccess.checkRolesAccess, updateDoctorData);

module.exports = router;