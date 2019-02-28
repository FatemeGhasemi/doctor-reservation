const express = require('express');
const doctorRepository = require("../../repositories/doctor");
const officeRepository = require("../../repositories/office");
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


const getDoctorListController = async (req, res) => {
    try {
        let result = [];
        const doctors = await doctorRepository.searchDoctorByCategory(req.query.categoryId)
        for (let j = 0; j < doctors.length; j++) {
            const doctor = doctors[j]
            const address = []
            let doctorData = {};
            doctorData.name = doctor.name
            doctorData.phoneNumber = doctor.phoneNumber
            doctorData.type = doctor.type
            const officeIds =doctor.officeId
            for(let i = 0 ; i<officeIds.length ; i++){
                const item = officeIds[i]
                const office = await officeRepository.findOfficeById(item);
                const officeAddress = office.address
                address.push(officeAddress);
            }
            doctorData.address = address

            result.push(doctorData)
        }

        res.json({message: "success operation", result: result})

    } catch (e) {
        console.log("getDoctorListController ERROR: ", e.message)
        res.status(500).json({message: e.message})
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
