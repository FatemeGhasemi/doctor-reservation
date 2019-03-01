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
        for (let i = 0; i < secretaryIds.length; i++) {
            const secretaryData = {}
            const secretaryId = secretaryIds[i]
            const secretary = await secretaryRepository.findSecretaryId(secretaryId);
            secretaryData.firstName = secretary.firstName
            secretaryData.lasttName = secretary.lastName
            secretaryData.phoneNumber = secretary.phoneNumber
            secretaryData.status = secretary.status
            secretaryData.active =secretary.active
            const office = await officeRepository.findOfficeById(secretary.officeId)
            secretaryData.office = office.address
            result.push(secretaryData)
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