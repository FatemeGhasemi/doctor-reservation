const express = require('express');
const doctorRepository = require("../../repositories/doctor");
const officeRepository = require("../../repositories/office");
const checkAccess = require('../../middlewares/authentication');
const router = express.Router();


/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const createNewOffice = async (req, res) => {
    try {
        const office = await officeRepository.createNewOffice(req.body)
        res.json({message: "success operation", result: office})

    } catch (e) {
        res.status(500).json({message: "fail operation createNewOffice", result: e.message})
    }
};


/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const updateOffice = async (req, res) => {
    try {
        const office = await officeRepository.updateOfficeData(req.params.id, req.body)
        res.json({message: "success operation", result: office})

    } catch (e) {
        res.status(500).json({message: "fail operation updateOffice", result: e.message})
    }
}


/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const searchOfficeByNearest = async (req, res) => {
    try {
        const office = await officeRepository.searchNearestSameCategoryOffice(
            req.query.long,
            req.query.lat,
            req.query.distance,
            req.query.categoryId
        )
        console.log("result searchOfficeByNearest: ",office)
        res.json({message: "success operation", result: office})

    } catch (e) {
        res.status(500).json({message: "fail operation updateOffice", result: e.message})
    }
}


const getAllOfInsuranceAnOfficeAccept = async (req,res)=>{
    try {
        const result =  await officeRepository.returnOfficeInsurance(req.query.officeId)
        res.json({message: "success getAllOfInsuranceAnOfficeAccept operation", result: result})

    }catch (e) {
        res.status(500).json({message: "fail operation getAllOfInsuranceAnOfficeAccept", result: e.message})
    }
}






router.post('/', checkAccess.validateJwt, checkAccess.checkRolesAccess, createNewOffice);
router.put('/:id', checkAccess.validateJwt, checkAccess.checkAccessWithPhoneNumberInOfficeRouter, checkAccess.checkRolesAccess, updateOffice);
router.get('/', searchOfficeByNearest)
router.get('/insurances', getAllOfInsuranceAnOfficeAccept)
module.exports = router;





