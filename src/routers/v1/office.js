const express = require('express');
const doctorRepository = require("../../repositories/doctor");
const officeRepository = require("../../repositories/office");
const checkAccess = require('../../middlewares/authentication');
const router = express.Router();


const createNewOffice = async (req, res) => {
    try {
        const office = await officeRepository.createNewOffice(req.body)
        res.json({message: "success operation", result: office})

    } catch (e) {
        res.status(500).json({message: "fail operation createNewOffice", result: e.message})
    }
};

const updateOffice = async (req, res) => {
    try {
        const office = await officeRepository.updateOfficeData(req.params.id, req.body)
        res.json({message: "success operation", result: office})

    } catch (e) {
        res.status(500).json({message: "fail operation updateOffice", result: e.message})
    }
}

const searchOfficeByNearest = async (req, res) => {
    try {
    await officeRepository.findNearestsPoints(req.query.long,req.query.lat)
    }catch (e) {
        res.status(500).json({message: "fail operation updateOffice", result: e.message})
    }
}


router.post('/', checkAccess.validateJwt, checkAccess.checkRolesAccess, createNewOffice);
router.put('/:id', checkAccess.validateJwt, checkAccess.checkAccessWithPhoneNumberInOfficeRouter, checkAccess.checkRolesAccess, updateOffice);
router.get('/',searchOfficeByNearest)
module.exports = router;





