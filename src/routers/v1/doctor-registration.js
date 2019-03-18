const express = require('express');
const doctorRepository = require("../../repositories/doctor");
const officeRepository = require("../../repositories/office");
const userRepository = require("../../repositories/user");
const categoryRepository = require("../../repositories/category");
const checkAccess = require('../../middlewares/authentication');
const jwtHelper = require('../../services/athorization/jwt');
const fileUpload = require('express-fileupload');
const uploadManager = require('../../services/upload-manager/cloudinary')
const utils = require('../../utils/utils')
const router = express.Router();


const getListOfRegisterTypes = async (req, res) => {
    try {
        const result = await categoryRepository.returnAllCategoryThatTheirParentsNull()
        res.json({message: "success getListOfRegisterTypes operation", result: result})

    } catch (e) {
        console.log("getListOfRegisterTypes ERROR: ", e)
        res.status(500).json({message: "getListOfRegisterTypes fail operation", result: e.message})
    }
}

const getListOfActivityField = async (req, res) => {
    try {
        let result = []
        const categories = await categoryRepository.findCategoryByParentName(req.query.parentName)
        for (let i = 0; i < categories.length; i++) {
            let data = {}
            const category = categories[i]
            data.categoryName = category.name
            data.categoryDisplayName = category.displayName
            result.push(data)
        }

        res.json({message: "success getListOfActivityField operation", result: result})

    } catch (e) {
        console.log("getListOfRegisterTypes ERROR: ", e)
        res.status(500).json({message: "getListOfActivityField fail operation", result: e.message})
    }
}


const registerDoctor = async (req, res) => {
    try {
        const categoryId = await categoryRepository.findCategoryIdByAnArrayOfCategories(req.body.categoriesArray)
        console.log("req.body.categoriesArray:", req.body.categoriesArray)
        req.body.categoryId = categoryId
        const doctor = await doctorRepository.createDoctorUser(req.body)
        res.json({message: "success registerDoctor operation", result: doctor})

    } catch (e) {
        console.log("registerDoctor ERROR: ", e)
        res.status(500).json({message: "registerDoctor fail operation", result: e.message})
    }
}


const uploadDocument = async (req, res) => {
    console.log('req.files : ', req.files);
    const image = req.files.image;
    console.log('req.files.image : ', image);
    try {

        const phone = res.locals.user.phoneNumber
        const result = await uploadManager.uploadToCloudinary(image)
        await doctorRepository.addPhotoToDoctorDocument(phone,result)
        res.json({message: `fileName uploaded`, result: {imageLink: result}});

    } catch (e) {
        console.log('error upload image to cloudinary ', e)
        res.status(500).json({message: "Problem with uploading image", result: e.message})
    }
}


router.get('/registerType', checkAccess.validateJwt, getListOfRegisterTypes);
router.get('/ActivityField', checkAccess.validateJwt, getListOfActivityField);
router.post('/', checkAccess.validateJwt, registerDoctor);
router.post('/uploadFile', checkAccess.validateJwt, uploadDocument);


module.exports = router;
