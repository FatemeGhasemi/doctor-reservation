const express = require('express');
const router = express.Router();
const userRepository = require('../../repositories/user');
const checkAccess = require('../../middlewares/authentication');
const jwtHelper = require('../../services/athorization/jwt');
const uploadManager = require('../../services/upload-manager/cloudinary')


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
            if(data.status === "active") {
                delete data['status']
            }
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
        let user;
        if(req.query.city){
             user = await userRepository.getUsersInCity(req.query.city)
        }
        else {
            user = await userRepository.getAllUsers()

        }
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
        const user = await userRepository.findUserByPhoneNumber(req.query.phoneNumber);
        res.json({message: "success operation", result: user})

    }catch (e) {
        res.status(500).json({message:"getOwnProfile fail operation" ,result:e.message})

    }
}



const uploadAvatarUrl = async (req,res)=>{
    try {
        const image = req.files.image;
        const result = uploadManager.uploadToCloudinary(image)
        const user = await userRepository.addAvatarUrl(res.locals.user.phoneNumber,result)
        res.json({message: "success operation", result: {imageUrl:result,userId:user.id}})

    }catch (e) {
        res.status(500).json({message:"getOwnProfile fail operation" ,result:e.message})

    }
}









router.post('/', createNewUser);
router.put('/:phoneNumber', checkAccess.validateJwt, checkAccess.checkAccess, updateUserData);
router.get('/AllUsers', checkAccess.validateJwt, checkAccess.checkRolesAccess,getAllUsers)
router.get('/', checkAccess.validateJwt, checkAccess.checkAccess,getOwnProfile);
router.post('/upload-avatarPhoto', checkAccess.validateJwt,uploadAvatarUrl);
module.exports = router;
