const express = require('express');
const secretaryRepository = require("../../repositories/secretary");
const userRepository = require("../../repositories/user");
const checkAccess = require('../../middlewares/authentication');
const jwtHelper = require('../../services/athorization/jwt');
const otpHelper = require('../../services/athorization/otp')
const officeRepository = require("../../repositories/office")
const router = express.Router();


/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const createUserAsSecretary = async (req, res) => {
    try {
        const doctorAsUser = res.locals.user
        const doctorPhone = doctorAsUser.phoneNumber
        const message ="شما را به عنوان منشی خود انتخاب کرده. در صورت تمایل کد چهار رقمی این پیام را برای ما در اپلیکیشن ارسال کنید" +doctorPhone + "کاربر به شماره تلفن "
        const user = await secretaryRepository.createSecretaryUser(req.body,doctorAsUser);
        const otpCode = await otpHelper.sendOtpHandler(req.body.phoneNumber, message )
        console.log("otpCode: ",otpCode);
        res.json({message: "success operation", result: user})
    } catch (e) {
        res.status(500).json({message: e.errors[0]})
    }
};


/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getListOfSecretaryByCategory = async (req, res) => {
    try {
        const result = secretaryRepository.searchSecretaryByCategory(req.query.categoryId, req.query.offset, req.query.limit);
        res.json({message: "success operation", result: result})
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
const getListOfSecretaryFullTextSearch = async (req, res) => {
    try {
        const result = secretaryRepository.searchSecretaryFullText(req.query.filter, req.query.offset, req.query.limit);
        res.json({message: "success operation", result: result})
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
const getSecretaryListController = async (req, res) => {
    try {
        let result;
        if (req.query.categoryId) {
            result = secretaryRepository.searchSecretaryByCategory(req.query.categoryId, req.query.offset, req.query.limit);
            await getListOfSecretaryByCategory(req, res)
        } else await getListOfSecretaryFullTextSearch(req, res)

    } catch (e) {
        console.log("getSecretaryListController ERROR: ", e.message)
    }
};


/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getOwnProfile = async (req,res)=>{
    try {
        let result = []
        const secretary = await secretaryRepository.findSecretaryId(req.query.id);
        result.push(secretary.firstName)
        result.push(secretary.lastName)
        result.push(secretary.phoneNumber)
        const office = await officeRepository.findOfficeById(secretary.officeId)
        result.push(office.phoneNumber)
        result.push(office.address)

        res.json({message: "success operation", result: result})

    }catch (e) {
        res.status(500).json({message:"getOwnProfile fail operation" ,result:e.message})

    }
}


/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const updateSecretaryData = async (req, res) => {
    try {
        const accessToken = jwtHelper.removeBearer(req.header('Authorization'));
        const phone = jwtHelper.verifyJwt(accessToken).phoneNumber;
        const role = await userRepository.getUserRoleByPhoneNumber(phone);
        if (req.body) {
            const data = req.body;
            if (role === "secretary") {
                delete data['status']
            }
            const user = await secretaryRepository.updateSecretaryData(req.params.phoneNumber, data);
            res.json({message: "success operation", result: user})
        }

    } catch (e) {
        res.status(500).json({message: e.message})
    }
};


// router.get('/', getSecretaryListController);
router.get('/', checkAccess.validateJwt, checkAccess.checkAccessById,getOwnProfile);
router.post('/', checkAccess.validateJwt,checkAccess.checkRolesAccess, createUserAsSecretary);
router.put('/:phoneNumber', checkAccess.validateJwt, checkAccess.checkRolesAccess, updateSecretaryData);

module.exports = router;