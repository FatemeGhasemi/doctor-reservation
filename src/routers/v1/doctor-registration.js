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
        let resu = []
        const result = await categoryRepository.returnAllCategoryThatTheirParentsNull()
        for (let i = 0; i < result.length; i++) {
            const data = result[i]
            if (data.categoryName !== "darooTajhizat") {
                resu.push(data)
            }
        }

        resu.push({
            "categoryName": "darooKhane",
            "categoryDisplayName": "داروخانه"
        })

        resu.push({
            "categoryName": "tajhizat",
            "categoryDisplayName": "تجهیزات پزشکی"
        })


        res.json({message: "success getListOfRegisterTypes operation", result: resu})

    } catch (e) {
        console.log("getListOfRegisterTypes ERROR: ", e)
        res.status(500).json({message: "getListOfRegisterTypes fail operation", result: e.message})
    }
}

const getListOfActivityField = async (req, res) => {
    try {
        let result = []
        let parent = req.query.parentName

        if (parent === "darooKhane" || parent === "tajhizat") {
            parent = "darooTajhizat"
        }

        const categories = await categoryRepository.findCategoryByParentName(parent)
        for (let i = 0; i < categories.length; i++) {
            let data = {}
            const category = categories[i]
            if (req.query.parentName === "darooKhane") {
                if (category.name.includes("darooKhane")) {
                    data.categoryName = category.name
                    data.categoryDisplayName = category.displayName
                    result.push(data)
                }
            }
            if (req.query.parentName === "tajhizat") {
                if (category.name.includes("tajhizat")) {
                    data.categoryName = category.name
                    data.categoryDisplayName = category.displayName
                    result.push(data)
                }
            }
        }

        res.json({message: "success getListOfActivityField operation", result: result})

    } catch (e) {
        console.log("getListOfRegisterTypes ERROR: ", e)
        res.status(500).json({message: "getListOfActivityField fail operation", result: e.message})
    }
}


const showListOfMedicalCenterListOfDepartmanParts = async (req, res) => {
    try {
        const data = [
            {name: "zanan", displayName: "زنان"},
            {name: "atfal", displayName: "اطفال"},
            {name: "dakheli", displayName: "داخلی"},
            {name: "ghalb", displayName: "قلب"},
            {name: "ortopedi", displayName: "ارتوپدی"},
            {name: "jarahiOmomi", displayName: "جراحی عمومی"},
            {name: "jarahiAsab", displayName: "جراحی اعصاب"},
            {name: "oroloji", displayName: "اورولوژی"},
            {name: "ravanPezeshki", displayName: "روانپزشکی"},
            {name: "gooshHalghBini", displayName: "گوش و حلق و بینی"},
            {name: "maghzAsab", displayName: "مغز و اعصاب"},
            {name: "poost", displayName: "پوست"},
            {name: "CCU", displayName: "CCU"},
            {name: "ICU", displayName: "ICU"},
            {name: "NICU", displayName: "NICU"}
        ]
        res.json({message: "success showListOfDepartmanParts operation", result: data})


    } catch (e) {
        console.log("showListOfMedicalCenterListOfDepartmanParts ERROR: ", e)
        res.status(500).json({message: "showListOfMedicalCenterListOfDepartmanParts fail operation", result: e.message})
    }
}


const showListOfDetectionCenterListOfDepartmanParts = async (req, res) => {
    try {
        const data1 = [
            {parent: "tasvirBardari", name: "radioLoji", displayName: "رادیولوژی"},
            {parent: "tasvirBardari", name: "sonografi", displayName: "سونوگرافی"},
            {parent: "tasvirBardari", name: "mamografi", displayName: "ماموگرافی"},
            {parent: "tasvirBardari", name: "siti", displayName: "سی تی"},
            {parent: "tasvirBardari", name: "MRI", displayName: "ام آر آی"}
        ];

        const data2 = [
            {parent: "azmayeshgah", name: "bioshimi", displayName: "بیوشیمی"},
            {parent: "azmayeshgah", name: "patoloji", displayName: "پاتولوژی"},
            {parent: "azmayeshgah", name: "zhenetik", displayName: "ژنتیک"},
            {parent: "azmayeshgah", name: "hormoni", displayName: "هورمونی"},
            {parent: "azmayeshgah", name: "cellFree", displayName: "cell free"},
        ];

        if (req.query.subParts === "tasvirBardari") {
            res.json({message: "success showListOfDetectionCenterListOfDepartmanParts operation", result: data1})
        }
        if (req.query.subParts === "azmayeshgah") {
            res.json({message: "success showListOfDetectionCenterListOfDepartmanParts operation", result: data2})
        }

    } catch (e) {
        console.log("showListOfDetectionCenterListOfDepartmanParts ERROR: ", e)
        res.status(500).json({
            message: "showListOfDetectionCenterListOfDepartmanParts fail operation",
            result: e.message
        })
    }
}


const registerDoctor = async (req, res) => {
    try {
        let departmanType;
        let doctor;
        const categories = req.body.categoriesArray
        req.body.phoneNumber = res.locals.user.phoneNumber
        const index1 = categories.indexOf("darooKhane");
        const index2 = categories.indexOf("tajhizat");

        if (index1 !== -1) {
            categories[index1] = "darooTajhizat";
        }
        if (index2 !== -1) {
            categories[index2] = "darooTajhizat";
        }


        const categoryId = await categoryRepository.findCategoryIdByAnArrayOfCategories(categories)
        console.log("req.body.categoriesArray:", req.body.categoriesArray)
        req.body.categoryId = categoryId
        if (categories[0] === "darmangaran") {
            if (req.body.gender && req.body.name && req.body.field && req.body.nationalId && req.body.grade &&
                req.body.cityName && req.body.medicalSystemNumber && categoryId) {
                doctor = await doctorRepository.createDoctorUser(req.body)
            } else {
                res.json({message: "some necessary fields are empty"})

            }
        }

        if (categories[0] === "darooTajhizat") {
            if (req.body.gender && req.body.name && req.body.field && req.body.nationalId && req.body.grade &&
                req.body.cityName && req.body.medicalSystemNumber && categoryId && req.body.departmanName &&
                req.body.creditExpiredTime && req.body.operationLicenseExpiredTime) {
                for (let i = 1; i < categories.length; i++) {
                    const category = categories[i]
                    if (category.includes("darooKhane")) {
                        req.body.departmanType = "داروخانه"
                        doctor = await doctorRepository.createDoctorUser(req.body)
                    }
                    if (category.includes("tajhizat")) {
                        if (req.body.storeName && req.body.creditExpiredTime) {
                            doctor = await doctorRepository.createDoctorUser(req.body)
                        }
                    }
                }
            } else {
                res.json({message: "some necessary fields are empty"})

            }


        }


        if (categories[0] === "marakezDarmani" || categories[0] === "marakezTashkhis") {
            departmanType = categories[categories.length - 1]
            req.body.departmanType = departmanType
            if (req.body.departmanName) {
                if (req.body.operationLicenseExpiredTime) {
                    if (categories[0] === "marakezDarmani") {
                        if (req.body.medicalCenterListOfDepartmanParts) {
                            if (req.body.departmanName) {
                                doctor = await doctorRepository.createDoctorUser(req.body)
                            } else {
                                res.json({message: "medical center list of departman name  cant be empty"})

                            }
                        } else {
                            res.json({message: "medical center list of departman parts  cant be empty"})
                        }
                    }
                    if (categories[0] === "marakezTashkhis") {
                        if (req.body.detectionCenterListOfDepartmanParts) {
                            if (req.body.departmanName) {
                                doctor = await doctorRepository.createDoctorUser(req.body)
                            } else {
                                res.json({message: "medical center list of departman name  cant be empty"})

                            }
                        } else {
                            res.json({message: "detection center list of departman parts  cant be empty"})

                        }
                    }

                } else {
                    res.json({message: "operation license expired time  cant be empty"})

                }
            } else {
                res.json({message: "departman name cant be empty"})

            }
        }


        res.json({message: "success registerDoctor operation", result: doctor})

    } catch (e) {
        console.log("registerDoctor ERROR: ", e)
        res.status(500).json({message: "registerDoctor fail operation", result: e.message})
    }
}


const uploadDocumentNationalCard = async (req, res) => {
    console.log('req.files : ', req.files);
    const image = req.files.image;
    console.log('req.files.image : ', image);
    try {

        const phone = res.locals.user.phoneNumber
        const result = await uploadManager.uploadToCloudinary(image, "nationalCard")
        await doctorRepository.addPhotoToDoctorDocument(phone, result)
        res.json({message: `fileName uploaded`, result: {imageLink: result}});

    } catch (e) {
        console.log('error upload image to cloudinary ', e)
        res.status(500).json({message: "Problem with uploading image", result: e.message})
    }
}


const uploadDocumentActivityLicense = async (req, res) => {
    console.log('req.files : ', req.files);
    const image = req.files.image;
    console.log('req.files.image : ', image);
    try {

        const phone = res.locals.user.phoneNumber
        const result = await uploadManager.uploadToCloudinary(image, "activityLicense")
        await doctorRepository.addPhotoToDoctorDocument(phone, result)
        res.json({message: `fileName uploaded`, result: {imageLink: result}});

    } catch (e) {
        console.log('error upload image to cloudinary ', e)
        res.status(500).json({message: "Problem with uploading image", result: e.message})
    }
}


const uploadDocumentOperationLicense = async (req, res) => {
    console.log('req.files : ', req.files);
    const image = req.files.image;
    console.log('req.files.image : ', image);
    try {

        const phone = res.locals.user.phoneNumber
        const result = await uploadManager.uploadToCloudinary(image, "operationLicense")
        await doctorRepository.addPhotoToDoctorDocument(phone, result)
        res.json({message: `fileName uploaded`, result: {imageLink: result}});

    } catch (e) {
        console.log('error upload image to cloudinary ', e)
        res.status(500).json({message: "Problem with uploading image", result: e.message})
    }
}


router.get('/registerType', checkAccess.validateJwt, getListOfRegisterTypes);
router.get('/ActivityField', checkAccess.validateJwt, getListOfActivityField);
router.get('/medicalDepartmanParts', checkAccess.validateJwt, showListOfMedicalCenterListOfDepartmanParts);
router.get('/detectionDepartmanParts', checkAccess.validateJwt, showListOfDetectionCenterListOfDepartmanParts);
router.post('/', checkAccess.validateJwt, registerDoctor);
router.post('/uploadNationalCard', checkAccess.validateJwt, uploadDocumentNationalCard);
router.post('/uploadOperationLicense', checkAccess.validateJwt, uploadDocumentOperationLicense);
router.post('/uploadActivityLicense', checkAccess.validateJwt, uploadDocumentActivityLicense);


module.exports = router;
