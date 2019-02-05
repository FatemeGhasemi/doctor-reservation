const express = require('express');
const router = express.Router();
const userRepository = require('../../repositories/user');
const checkAccess = require('../../middlewares/authentication');
const jwtHelper = require('../../services/athorization/jwt');

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
        const accessToken = jwtHelper.removeBearer(req.header('Authorization'));
        const phone = jwtHelper.verifyJwt(accessToken);
        const role = await userRepository.getUserRoleByPhoneNumber(phone);
        if (role === "user" || role === "doctor" || role === "secretary") {
            delete data['role'];
            delete data['status']
        }
        delete data['phoneNumber'];
        const user = await userRepository.updateUser(req.params.phoneNumber, data);
        res.json({message: "success operation", result: user})

    } catch (e) {
        res.status(500).json({message: e.message})
    }
};


router.post('/', createNewUser);
router.put('/:phoneNumber', checkAccess.validateJwt, checkAccess.checkRolesAccess, updateUserData);
module.exports = router;
