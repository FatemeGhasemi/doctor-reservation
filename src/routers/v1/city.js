const express = require('express');
const doctorRepository = require("../../repositories/doctor");
const officeRepository = require("../../repositories/office");
const cityRepository = require("../../repositories/city");
const checkAccess = require('../../middlewares/authentication');
const jwtHelper = require('../../services/athorization/jwt');
const router = express.Router();


const createNewCity = async (req,res)=>{
    try {
        const result = await cityRepository.createNewCity(req.body)
        res.json({message: "success createNewCity operation ",result:result})
    }catch (e) {
        console.log("createNewCity ERROR: ", e)
        res.status(500).json({message: e.message})
    }
}



const updateCity = async (req,res)=>{
    try {
        const result = await cityRepository.updateCityData(req.params.cityId,req.body)
        res.json({message: "success updateCity operation ",result:result})
    }catch (e) {
        console.log("updateCity ERROR: ", e)
        res.status(500).json({message: e.message})
    }
}


const deleteCity =  async (req,res)=>{
    try {
        const result = await cityRepository.deleteCity(req.params.cityId)
        res.json({message: "success deleteCity operation ",result:result})
    }catch (e) {
        console.log("deleteCity ERROR: ", e)
        res.status(500).json({message: e.message})
    }
}


const findCityByCode = async (req,res)=>{
    try {
        const result = await cityRepository.searchCityByCode(req.query.code)
        res.json({message: "success findCityByCode operation ",result:result})
    }catch (e) {
        console.log("findCityByCode ERROR: ", e)
        res.status(500).json({message: e.message})
    }
}



router.post('/', checkAccess.validateJwt, checkAccess.checkRolesAccess, createNewCity);
router.put('/:cityId', checkAccess.validateJwt, checkAccess.checkRolesAccess, updateCity);
router.delete('/:cityId', checkAccess.validateJwt, checkAccess.checkRolesAccess, deleteCity);
router.get('/', checkAccess.validateJwt, checkAccess.checkRolesAccess, findCityByCode);


module.exports = router;