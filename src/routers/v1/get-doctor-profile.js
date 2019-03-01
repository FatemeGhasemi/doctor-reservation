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
        const doctor = await doctorRepository.searchDoctorByPhoneNumber(req.query.phoneNumber)
        const address = []
        let doctorData = {};
        doctorData.name = doctor.name
        doctorData.phoneNumber = doctor.phoneNumber
        doctorData.type = doctor.type
        const officeIds = doctor.officeId
        console.log("officeIds: ", officeIds)
        for (let i = 0; i < officeIds.length; i++) {
            const item = officeIds[i]
            console.log("item: ", item)
            const office = await officeRepository.findOfficeById(item);
            // console.log("office: ",office)
            const officeAddress = office.address
            const officePhone = office.phoneNumber

            address.push(officeAddress);
            address.push(officePhone);
            console.log("address1: ", address)

        }
        console.log("address2: ", address)
        doctorData.address = address

        result.push(doctorData)

        res.json({message: "success operation", result: result})

    } catch (e) {
        console.log("getOwnProfile ERROR: ", e.message)
        res.status(500).json({message: e.message})
    }
}




// router.get('/', checkAccess.validateJwt, checkAccess.checkAccess,getOwnProfile);
router.get('/',getOwnProfile);

module.exports = router;