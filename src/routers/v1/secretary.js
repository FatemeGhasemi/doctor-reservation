const express = require('express');
const secretaryRepository = require("../../repositories/secretary");
const userRepository = require("../../repositories/user");
const checkAccess = require('../../middlewares/authentication');
const jwtHelper = require('../../services/athorization/jwt');
const router = express.Router();


const createUserAsSecretary = async (req, res) => {
    try {
        const user = await secretaryRepository.createSecretaryUser(req.body);
        res.json({message: "success operation", result: user})
    } catch (e) {
        res.status(500).json({message: e.message})
    }
};

const getListOfSecretaryByCategory = async (req, res) => {
    try {
        const result = secretaryRepository.searchSecretaryByCategory(req.query.categoryId, req.query.offset, req.query.limit);
        res.json({message: "success operation", result: result})
    } catch (e) {
        res.status(500).json({message: e.message})
    }
};


const getListOfSecretaryFullTextSearch = async (req, res) => {
    try {
        const result = secretaryRepository.searchSecretaryFullText(req.query.filter, req.query.offset, req.query.limit);
        res.json({message: "success operation", result: result})
    } catch (e) {
        res.status(500).json({message: e.message})
    }
};


const getSecretaryListController = async (req, res) => {
    try {
        if (req.query.categoryId) {
            await getListOfSecretaryByCategory(req, res)
        } else await getListOfSecretaryFullTextSearch(req, res)

    } catch (e) {
        console.log("getSecretaryListController ERROR: ", e.message)
    }
};


const updateSecretaryData = async (req, res) => {
    try {
        console.log("hi to update");
        const data = req.body;
        const accessToken = jwtHelper.removeBearer(req.header('Authorization'));
        const phone = jwtHelper.verifyJwt(accessToken).phoneNumber;
        const role = await userRepository.getUserRoleByPhoneNumber(phone);
        if (role === "secretary") {
            delete data['status']

        }
        const user = await secretaryRepository.updateSecretaryData(req.params.phoneNumber, data);
        res.json({message: "success operation", result: user})

    } catch (e) {
        res.status(500).json({message: e.message})
    }
};


router.get('/', getSecretaryListController);
router.post('/', checkAccess.validateJwt, createUserAsSecretary);
router.put('/:phoneNumber', checkAccess.validateJwt, checkAccess.checkRolesAccess, updateSecretaryData);

module.exports = router;