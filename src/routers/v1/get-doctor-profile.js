const express = require('express');
const secretaryRepository = require("../../repositories/secretary");
const userRepository = require("../../repositories/user");
const checkAccess = require('../../middlewares/authentication');
const jwtHelper = require('../../services/athorization/jwt');
const otpHelper = require('../../services/athorization/otp')
const officeRepository = require("../../repositories/office")
const doctorRepository = require("../../repositories/doctor")
const router = express.Router();


/**
 * show doctors her/his own profile
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getOwnProfile = async (req, res) => {
    try {
        let result = [];
        let isFav = false;
        const doctor = await doctorRepository.findDoctorById(req.query.id)
        const user = await userRepository.findUserById(res.locals.user.id)
        const favList = user.favoriteList
        favList.forEach(item=>{
            if(item == doctor.id){
                isFav = true
            }
        })

        const officeIds = doctor.officeId
        for (let i = 0; i < officeIds.length; i++) {
            let doctorData = {officeData:{}};
            doctorData.name = doctor.name
            doctorData.phoneNumber = doctor.phoneNumber
            doctorData.type = doctor.type
            doctorData.doctorAvatarUrl = doctor.avatarUrl
            const item = officeIds[i]
            const office = await officeRepository.findOfficeById(item);
             doctorData.officeData.officeAddress = office.address
             doctorData.officeData.officelat = office.lat
             doctorData.officeData.officeLong = office.long
            doctorData.officeData.officePhone = office.phoneNumber
            doctorData.officeData.officePictures = office.photoUrl
            doctorData.isDoctorInUserFavList = isFav
            result.push(doctorData);
        }
        res.json({message: "success operation", result: result})
    } catch (e) {
        console.log("getOwnProfile ERROR: ", e.message)
        res.status(500).json({message: e.message})
    }
};




// router.get('/', checkAccess.validateJwt, checkAccess.checkAccess,getOwnProfile);
router.get('/',checkAccess.validateJwt,getOwnProfile);

module.exports = router;
