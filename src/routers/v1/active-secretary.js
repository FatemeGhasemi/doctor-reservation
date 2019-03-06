const express = require('express');
const secretaryRepository = require("../../repositories/secretary");
const doctorRepository = require("../../repositories/doctor");
const officeRepository = require("../../repositories/office");
const checkAccess = require('../../middlewares/authentication');
const jwtHelper = require('../../services/athorization/jwt');
const otpHelper = require('../../services/athorization/otp')
const router = express.Router();

/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const activeSecretaryAccount = async (req, res) => {
    try {
        if (await otpHelper.isOtpValid(req.body.otp, req.params.phoneNumber)) {
            await secretaryRepository.activateSecretary(req.params.phoneNumber);
            await otpHelper.deleteOtpCode(req.body.phoneNumber);
            const jwtCode = jwtHelper.jwtGenerator({phoneNumber: req.params.phoneNumber});
            res.json({message: 'success', result: jwtCode})
        } else {
            res.status(403).json({message: "un authorize"})
        }
    } catch (e) {
        console.log("loginRegisterUser ERROR: ", e.message)
        res.status(500).json({message: e.message})

    }
}


/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getListOfDoctorSecretary = async (req, res) => {
    try {
        const result = []
        const doctor = await doctorRepository.findDoctorById(req.query.id)
        const secretaryIds = doctor.secretaryId
        const officeIds = doctor.officeId
        if(officeIds.length !==0) {
            for (let i = 0; i < officeIds.length; i++) {
                const officeData = {}
                const officeId = officeIds[i]
                const office = await officeRepository.findOfficeById(officeId);
                const secretaryId = office.secretaryId
                const secretary = await secretaryRepository.findSecretaryId(secretaryId)
                officeData.secretaryName = secretary.lastName
                officeData.secretaryPhone = secretary.phoneNumber
                officeData.secretaryId = secretary.id
                officeData.address = office.address
                officeData.lat = office.lat
                officeData.long = office.long
                result.push(officeData)
            }
        }
        else {
            res.status(400).json({message: "this doctor doesnt have any office"})
        }
        res.json({message: "success getListOfDoctorSecretary operation:  ", result: result})

    } catch (e) {
        console.log("getListOfDoctorSecretary ERROR: ", e.message)
        res.status(500).json({message: e.message})
    }
}


router.put('/:phoneNumber', activeSecretaryAccount);
router.get('/', getListOfDoctorSecretary);


module.exports = router;
