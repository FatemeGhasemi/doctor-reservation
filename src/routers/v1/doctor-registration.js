const express = require('express');
const doctorRepository = require("../../repositories/doctor");
const officeRepository = require("../../repositories/office");
const userRepository = require("../../repositories/user");
const categoryRepository = require("../../repositories/category");

const checkAccess = require('../../middlewares/authentication');
const jwtHelper = require('../../services/athorization/jwt');
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
            const category = categories[i]
            result.push(category.displayName)
            // const lastItemInCircle = await categoryRepository.findCategoryByParentName(category.name)
            // if (lastItemInCircle === [] || lastItemInCircle === null || lastItemInCircle === undefined){
            //
            // }

        }

        res.json({message: "success getListOfActivityField operation", result: result})

    } catch (e) {
        console.log("getListOfRegisterTypes ERROR: ", e)
        res.status(500).json({message: "getListOfActivityField fail operation", result: e.message})
    }
}


const registerDoctor = async (req, res) => {
    try {
        // ["darmangaran", "dandanPezeshki", "jarahOmoomi"]
        const categoryId = await categoryRepository.findCategoryIdByAnArrayOfCategories(req.body.categoriesArray)
        console.log("req.body.categoriesArray:",req.body.categoriesArray)
        req.body.categoryId = categoryId
        const doctor = await doctorRepository.createDoctorUser(req.body)
        res.json({message: "success registerDoctor operation", result: doctor})

    } catch (e) {
        console.log("registerDoctor ERROR: ", e)
        res.status(500).json({message: "registerDoctor fail operation", result: e.message})
    }


}


router.get('/registerType', checkAccess.validateJwt, getListOfRegisterTypes);
router.get('/ActivityField', checkAccess.validateJwt, getListOfActivityField);
router.post('/', registerDoctor);



module.exports = router;
