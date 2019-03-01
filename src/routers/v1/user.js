const express = require('express');
const router = express.Router();
const userRepository = require('../../repositories/user');
const checkAccess = require('../../middlewares/authentication');
const jwtHelper = require('../../services/athorization/jwt');


/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const createNewUser = async (req, res) => {
    try {
        const user = await userRepository.createUser(req.body.phoneNumber);
        res.json({message: "success operation", result: user})

    } catch (e) {
        res.status(500).json({message: e.message})
    }
};


/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const updateUserData = async (req, res) => {
    try {
        const data = req.body;
        const accessToken = jwtHelper.removeBearer(req.header('Authorization'));
        const phone = jwtHelper.verifyJwt(accessToken).phoneNumber;
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


/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getAllUsers = async (req, res) => {
    try {
        const user = await userRepository.getAllUsers()
        res.json({message: "success operation", result: user})


    } catch (e) {
        res.status(500).json({message: e.message})

    }
}


/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getOwnProfile = async (req,res)=>{
    try {
        const user = await userRepository.findUserById(req.query.id);
        res.json({message: "success operation", result: user})

    }catch (e) {
        res.status(500).json({message:"getOwnProfile fail operation" ,result:e.message})

    }
}





router.post('/', createNewUser);
router.put('/:phoneNumber', checkAccess.validateJwt, checkAccess.checkAccess, updateUserData);
// router.get('/', checkAccess.validateJwt, checkAccess.checkRolesAccess,getAllUsers)
router.get('/', checkAccess.validateJwt, checkAccess.checkAccessById,getOwnProfile);
module.exports = router;
