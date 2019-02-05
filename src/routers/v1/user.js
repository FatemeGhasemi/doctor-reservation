const express = require('express');
const router = express.Router();
const userRepository = require('../../repositories/user');
const checkAccess = require('../../middlewares/authentication');

const createNewUser = async (req, res) => {
    try {
        const user = await userRepository.createUser(req.body.phoneNumber);
        res.json({message: "success operation", result: user})

    } catch (e) {
        res.status(500).json({message: e.message})
    }
};

const updateUserData = async (req, res) => {
    try {
        const data = req.body;
        const role = await userRepository.getUserRoleByPhoneNumber(req.params.phoneNumber);
        if (role === "user" || role === "doctor" || role === "secretary") {
            delete data['role'];
            delete data['status']
        }
        console.log("updateUserData:  ");
        delete data['phoneNumber'];
        const user = await userRepository.updateUser(req.params.phoneNumber, data);
        res.json({message: "success operation", result: user})

    } catch (e) {
        res.status(500).json({message: e.message})
    }
};


router.post('/', createNewUser);
router.put('/:phoneNumber', checkAccess.validateJwt, checkAccess.checkAccess, updateUserData);
module.exports = router;
