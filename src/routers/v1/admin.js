const express = require('express');
const router = express.Router();
const userRepository = require('../../repositories/user');
const doctorRepository = require('../../repositories/doctor');
const checkAccess = require('../../middlewares/authentication');


const updateUserData = async (req, res) => {
    try {
        const user = await userRepository.updateUserByAdmin(req.body.phoneNumber, req.body);
        res.json({message: "success operation", result: user})

    } catch (e) {
        res.status(500).json({message: e.message})
    }
};

const updateDoctorData = async (req, res) => {
    try {
        const user = await doctorRepository.updateDoctorDataByAdmin(req.params.id, req.body);
        res.json({message: "success operation", result: user})

    } catch (e) {
        res.status(500).json({message: e.message})
    }
};

const update = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userRepository.findUserById(id);
        if (user.role === "admin") {
            //    TODO fill admin repo
        }
        if (user.role === "doctor") {
            await updateDoctorData(req, res)
        }
        if (user.role === "secretary") {
        //    TODO fill secretary repo
        }
        if (user.role === "user") {
            await updateUserData(req, res)
        }

    } catch (e) {
        res.status(500).json({message: e.message})
    }
};

const getUsersByPhoneNumber = async (req, res) => {
    try {
        const user = await userRepository.findUserByPhoneNumber(req.query.phoneNumber)
        res.json({message: "success operation", result: user})
    } catch (e) {
        res.status(500).json({message: e.message})

    }
};

//TODO its rout should be /users because of acl logic
router.put('/', checkAccess.checkAccess, update);
router.get('/', checkAccess.checkRolesAccess, getUsersByPhoneNumber);
module.exports = router;