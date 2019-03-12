const express = require('express');
const router = express.Router();
const advertiseRepository = require('../../repositories/advertise');
const checkAccess = require('../../middlewares/authentication');


const addNewAdvertise = async (req, res) => {
    try {
        const result = await advertiseRepository.addNewAdvertise(req.body)
        res.json({message: "add new advertise success operation: ", result})
    } catch (e) {
        console.log("add new advertise operation failed:", e)
        res.status(500).json({message: e.message})
    }
}


const getAllAdvertise = async (req, res) => {
    try {
        const result = await advertiseRepository.getAllAdvertise()
        res.json({message: "getAllAdvertise success operation: ", result})
    } catch (e) {
        console.log("getAllAdvertise operation failed:", e)
        res.status(500).json({message: e.message})
    }
}


const getOneAdvertiseById = async (req, res) => {
    try {
        const result = await advertiseRepository.findAdvertiseById(req.query.id)
        res.json({message: "getOneAdvertiseById success operation: ", result})
    } catch (e) {
        console.log("getOneAdvertiseById operation failed:", e)
        res.status(500).json({message: e.message})
    }
}


const getActiveAdvertise = async (req, res) => {
    try {
        const result = await advertiseRepository.findAdvertiseByStatus("active")
        res.json({message: "getActiveAdvertise success operation: ", result})
    } catch (e) {
        console.log("getActiveAdvertise operation failed:", e)
        res.status(500).json({message: e.message})
    }
}


const getDeletedAdvertise = async (req, res) => {
    try {
        const result = await advertiseRepository.findAdvertiseByStatus("delete")
        res.json({message: "getActiveAdvertise success operation: ", result})
    } catch (e) {
        console.log("getActiveAdvertise operation failed:", e)
        res.status(500).json({message: e.message})
    }
}


const getDeactivateAdvertise = async (req, res) => {
    try {
        const result = await advertiseRepository.findAdvertiseByStatus("deactivate")
        res.json({message: "getDeactivateAdvertise success operation: ", result})
    } catch (e) {
        console.log("getDeactivateAdvertise operation failed:", e)
        res.status(500).json({message: e.message})
    }
}


const updateAdvertise = async (req, res) => {
    try {
        const result = await advertiseRepository.updateAdvertise(req.body, req.params.id)
        res.json({message: "updateAdvertise success operation: ", result})
    } catch (e) {
        console.log("updateAdvertise operation failed:", e)
        res.status(500).json({message: e.message})
    }
}


const deactivateAdvertise = async (req, res) => {
    try {
        const result = await advertiseRepository.deactivateOneAdvertise(req.params.id)
        res.json({message: "deactivateAdvertise success operation: ", result})
    } catch (e) {
        console.log("deactivateAdvertise operation failed:", e)
        res.status(500).json({message: e.message})
    }
}


const deleteAdvertise = async (req, res) => {
    try {
        const result = await advertiseRepository.deleteOneAdvertise(req.params.id)
        res.json({message: "deactivateAdvertise success operation: ", result})
    } catch (e) {
        console.log("deactivateAdvertise operation failed:", e)
        res.status(500).json({message: e.message})
    }
}



const listOfAdvertisesToShow = async (req, res) => {
    try {
        const result = await advertiseRepository.showActiveAdvertises()
        res.json({message: "listOfAdvertisesToShow success operation: ", result})
    } catch (e) {
        console.log("listOfAdvertisesToShow operation failed:", e)
        res.status(500).json({message: e.message})
    }
}


//TODO should handle access list to do each api
router.post('/', checkAccess.validateJwt, checkAccess.checkRolesAccess, addNewAdvertise)
router.get('/active', getActiveAdvertise)
router.get('/showAdvertisesList', listOfAdvertisesToShow)
router.get('/deactivate', checkAccess.validateJwt, checkAccess.checkRolesAccess, getDeactivateAdvertise)
router.get('/deleted', checkAccess.validateJwt, checkAccess.checkRolesAccess, getDeletedAdvertise)
router.get('/', checkAccess.validateJwt, checkAccess.checkRolesAccess,getAllAdvertise)
router.get('/id',checkAccess.validateJwt, checkAccess.checkRolesAccess, getOneAdvertiseById)
router.put('/:id',checkAccess.validateJwt, checkAccess.checkRolesAccess, updateAdvertise)
router.put('/:id/deactivate',checkAccess.validateJwt, checkAccess.checkRolesAccess, deactivateAdvertise)
router.put('/:id/delete',checkAccess.validateJwt, checkAccess.checkRolesAccess, deleteAdvertise)


module.exports = router;
