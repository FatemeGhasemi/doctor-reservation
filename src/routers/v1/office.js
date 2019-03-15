const express = require('express');
const doctorRepository = require("../../repositories/doctor");
const officeRepository = require("../../repositories/office");
const insurancesRepository = require("../../repositories/insurance");
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
        console.log("result searchOfficeByNearest: ", office)
        res.json({message: "success operation", result: office})

    } catch (e) {
        res.status(500).json({message: "fail operation searchOfficeByNearest", result: e.message})
    }
}


const getAllOfInsuranceAnOfficeAccept = async (req, res) => {
    try {
        const result = await officeRepository.returnOfficeData(req.query.officeId)
        res.json({message: "success getAllOfInsuranceAnOfficeAccept operation", result: result})

    } catch (e) {
        res.status(500).json({message: "fail operation getAllOfInsuranceAnOfficeAccept", result: e.message})
    }
}


const getListOfOfficesWithSpecialCityAndGenderAndDoctorTypeAndInsuranceName = async (req, res) => {
    try {
        const result = await insurancesRepository.findOfficeByInsuranceNameAndGenderAndCategoryId(
            req.query.insuaranceName,
            req.query.gender,
            req.query.cityName,
            req.query.categoryId
            )
        res.json({
            message: "success getListOfOfficesWithSpecialCityAndGenderAndDoctorTypeAndInsuranceName operation",
            result: result
        })

    } catch (e) {
        res.status(500).json({
            message: "fail operation getListOfOfficesWithSpecialCityAndGenderAndDoctorTypeAndInsuranceName",
            result: e.message
        })
    }
}


const getListOfOfficeInCity = async (req, res) => {
    try {
        let result = []
        const offices = await officeRepository.findOfficeByCity(req.query.cityName)
        for (let i=0;i<offices.length;i++){
            const office = offices[i]
            if(office.categoryId === req.query.categoryId){
                result.push(office)
            }
        }
        res.json({message: "success getListOfOfficeInCity operation", result: result})

    } catch (e) {
        res.status(500).json({
            message: "fail operation getListOfOfficeInCity",
            result: e.message
        })
    }
}

const getListOfOfficeWithSpecialGenderDoctor = async (req, res) => {
    try {
        const result = await officeRepository.findOfficeByDoctorGender(req.query.gender,req.query.categoryId)
        res.json({message: "success getListOfOfficeWithSpecialGenderDoctor operation", result: result})

    } catch (e) {
        res.status(500).json({
            message: "fail operation getListOfOfficeWithSpecialGenderDoctor",
            result: e.message
        })
    }
}


const findListOfOfficeAcceptSpecialInsurance = async (req, res) => {
    try {
        let result = []
        const offices = await officeRepository.findOfficeByCity(req.query.cityName)
        const insurance = await insurancesRepository.findInsuranceByName(req.query.insuranceName)
        const insuaranceDisplayName = insurance[0].displayName
        for (let i = 0; i < offices.length; i++) {
            let data = {}
            const office = offices[i]
            const officeInsurances = office.insurance
            for (let j = 0; j < officeInsurances.length; j++) {
                const officeInsurance = officeInsurances[j]
                if (officeInsurance === insuaranceDisplayName) {
                    result.push(office)
                }
            }
        }
        res.json({message: "success findListOfOfficeAcceptSpecialInsurance operation", result: result})

    } catch (e) {
        res.status(500).json({
            message: "fail operation findListOfOfficeAcceptSpecialInsurance",
            result: e.message
        })
    }
}


router.post('/', checkAccess.validateJwt, checkAccess.checkRolesAccess, createNewOffice);
router.put('/:id', checkAccess.validateJwt, checkAccess.checkAccessWithPhoneNumberInOfficeRouter, checkAccess.checkRolesAccess, updateOffice);
router.get('/', searchOfficeByNearest)
router.get('/insurances', getAllOfInsuranceAnOfficeAccept)
router.get('/city/category', getListOfOfficeInCity)
router.get('/gender/category', getListOfOfficeWithSpecialGenderDoctor)
router.get('/insuranceName/city', findListOfOfficeAcceptSpecialInsurance)
router.get('/insurances/gender/city/category', getListOfOfficesWithSpecialCityAndGenderAndDoctorTypeAndInsuranceName)
module.exports = router;





