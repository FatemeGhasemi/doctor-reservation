const express = require('express');
const secretaryRepository = require("../../repositories/secretary");
const userRepository = require("../../repositories/user");
const checkAccess = require('../../middlewares/authentication');
const jwtHelper = require('../../services/athorization/jwt');
const otpHelper = require('../../services/athorization/otp')
const officeRepository = require("../../repositories/office")
const doctorRepository = require("../../repositories/doctor")
const router = express.Router();


const deletePhotoFromGallery = async (req, res) => {
    try {
        const result = await officeRepository.deletePhotoFromGallery(req.params.id, req.query.link)
        res.json({message: "success deletePhotoFromGallery operation ", result: result})

    } catch (e) {
        res.status(500).json({message: "fail deletePhotoFromGallery operation ", result: e.message})
    }
};


const addPhotoToGallery = async (req, res) => {
    try {
        const result =await officeRepository.addPhotoToGallery(req.params.id, req.query.link)
        res.json({message: "success addPhotoToGallery operation ", result: result})

    } catch (e) {
        res.status(500).json({message: "fail addPhotoToGallery operation ", result: e.message})
    }
};


router.delete('/:id', checkAccess.validateJwt, checkAccess.checkRolesAccess, deletePhotoFromGallery);
router.put('/:id', checkAccess.validateJwt, checkAccess.checkRolesAccess, addPhotoToGallery);

module.exports = router;
