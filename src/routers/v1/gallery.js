const express = require('express');
const secretaryRepository = require("../../repositories/secretary");
const userRepository = require("../../repositories/user");
const checkAccess = require('../../middlewares/authentication');
const jwtHelper = require('../../services/athorization/jwt');
const otpHelper = require('../../services/athorization/otp')
const officeRepository = require("../../repositories/office")
const doctorRepository = require("../../repositories/doctor")
const uploadManager = require('../../services/upload-manager/cloudinary')

const router = express.Router();


const deletePhotoFromGallery = async (req, res) => {
    try {
        const result = await officeRepository.deletePhotoFromGallery(req.params.id, req.query.link)
        res.json({message: "success deletePhotoFromGallery operation ", result: result})

    } catch (e) {
        res.status(500).json({message: "fail deletePhotoFromGallery operation ", result: e.message})
    }
};



const uploadPhotoToOfficeGallery = async (req, res) => {
    console.log('req.files : ', req.files);
    const image = req.files.image;
    console.log('req.files.image : ', image);
    try {

        const result = await uploadManager.uploadToCloudinary(image)
        await officeRepository.addPhotoToGallery(req.query.officeId,result)
        res.json({message: `fileName uploaded`, result: {officeId:req.query.officeId,imageLink: result}});

    } catch (e) {
        console.log('error upload image to cloudinary ', e)
        res.status(500).json({message: "Problem with uploading image", result: e.message})
    }
}







router.delete('/:id', checkAccess.validateJwt, checkAccess.checkRolesAccess, deletePhotoFromGallery);
router.post('/uploadPhotoToGallery', checkAccess.validateJwt, checkAccess.checkRolesAccess, uploadPhotoToOfficeGallery);


module.exports = router;
