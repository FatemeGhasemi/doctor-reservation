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
        res.status(500).json({message: "fail operation", result: e.message})
    }
};

router.post('/',checkAccess.validateJwt, checkAccess.checkRolesAccess, createNewOffice);
module.exports = router;





