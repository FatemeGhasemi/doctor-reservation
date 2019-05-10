const express = require('express');
const doctorRepository = require("../../repositories/doctor");
const officeRepository = require("../../repositories/office");
const userRepository = require("../../repositories/user");
const checkAccess = require('../../middlewares/authentication');
const jwtHelper = require('../../services/athorization/jwt');
const router = express.Router();


/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const createUserAsDoctor = async (req, res) => {
    try {
        const user = await doctorRepository.createDoctorUser(req.body);
        res.json({message: "success operation", result: user})
    } catch (e) {
        res.status(500).json({message: e.message})
    }
};


/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getDoctorListController1 = async (req, res) => {
    try {
        let result = [];
        const doctors = await doctorRepository.searchDoctorByCategory(req.query.categoryId)
        for (let j = 0; j < doctors.length; j++) {
            const doctor = doctors[j]
            const address = []
            let doctorData = {};
            let addressData = {}
            doctorData.name = doctor.name
            doctorData.phoneNumber = doctor.phoneNumber
            doctorData.type = doctor.type
            doctorData.avatarUrl = doctor.avatarUrl
            const officeIds = doctor.officeId
            for (let i = 0; i < officeIds.length; i++) {
                const item = officeIds[i]
                const office = await officeRepository.findOfficeById(item);
                const officeAddress = office.address
                const officePhone = office.phoneNumber
                addressData.address = officeAddress
                addressData.lat = office.lat
                addressData.long = office.long
                addressData.phoneNumber = officePhone
                address.push(addressData);
            }
            doctorData.address = address

            result.push(doctorData)
        }

        res.json({message: "success operation", result: result})

    } catch (e) {
        console.log("getDoctorListController ERROR: ", e.message)
        res.status(500).json({message: e.message})
    }
};


/**
 * get a list of doctors by the same categoryIds
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getDoctorListController = async (req, res) => {
    try {
        let result = [];
        const doctors = await doctorRepository.searchDoctorByCategory(req.query.categoryId)
        for (let j = 0; j < doctors.length; j++) {
            const doctor = doctors[j]
            if (doctor.status === "approved") {
                const officeIds = doctor.officeId
                for (let i = 0; i < officeIds.length; i++) {
                    let doctorData = {};
                    doctorData.name = doctor.name
                    doctorData.phoneNumber = doctor.phoneNumber
                    doctorData.type = doctor.type
                    doctorData.doctorAvatarUrl = doctor.avatarUrl
                    doctorData.doctorRate = doctor.rate
                    const item = officeIds[i]
                    const office = await officeRepository.findOfficeById(item);
                    const officeAddress = office.address
                    const officePhone = office.phoneNumber
                    doctorData.address = officeAddress
                    doctorData.lat = office.lat
                    doctorData.long = office.long
                    doctorData.phoneNumber = officePhone
                    doctorData.officePhotos = office.photoUrl
                    doctorData.officeId = item
                    result.push(doctorData)
                }
            }
        }
        res.json({message: "success operation", result: result})

    } catch (e) {
        console.log("getDoctorListController ERROR: ", e.message)
        res.status(500).json({message: e.message})
    }
};


const getOfficesInOrderOfCategoryAndCity = async (req, res) => {
    try {
        const result = await doctorRepository.searchDoctorOfficeByCategoryAndCity(req.query.categoryId, req.query.cityId)
        res.json({message: "success getOfficesInOrderOfCategoryAndCity operation", result: result})
    } catch (e) {
        console.log("getOfficesInOrderOfCategoryAndCity ERROR: ", e.message)
        res.status(500).json({message: e.message})
    }
}


/**
 * update doctor profile data
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const updateDoctorData = async (req, res) => {
    try {
        console.log("hi to update")
        const data = req.body;
        const accessToken = jwtHelper.removeBearer(req.header('Authorization'));
        const phone = jwtHelper.verifyJwt(accessToken).phoneNumber;
        const role = await userRepository.getUserRoleByPhoneNumber(phone);
        if (role === "doctor") {
            delete data['status']

        }
        const user = await doctorRepository.updateDoctorData(req.params.phoneNumber, data);
        res.json({message: "success operation", result: user})

    } catch (e) {
        res.status(500).json({message: e.message})
    }
};


const getDoctorDataById = async (req, res) => {
    try {
        const doctor = await doctorRepository.findDoctorById(req.query.id)
        res.json({message: "success operation", result: doctor})
    } catch (e) {
        console.log("getDoctorDataById ERROR: ", e)
        res.status(500).json({message: e.message})
    }
}

const getDoctorDataIfUserWant = async (req,res)=>{
    try {
        let result = []
        const doctor = await doctorRepository.findDoctorById(req.query.id)
        let isFav = false;
        const user = await userRepository.findUserById(res.locals.user.id)
        const favList = user.favoriteList
        favList.forEach(item=>{
            if(item == doctor.id){
                isFav = true
            }
        })
        const officeIds = doctor.officeId
        for (let i = 0; i < officeIds.length; i++) {
            let doctorData = {officeData:{}};
            doctorData.name = doctor.name
            doctorData.phoneNumber = doctor.phoneNumber
            doctorData.type = doctor.type
            doctorData.doctorAvatarUrl = doctor.avatarUrl
            const item = officeIds[i]
            const office = await officeRepository.findOfficeById(item);
            doctorData.officeData.officeAddress = office.address
            doctorData.officeData.officelat = office.lat
            doctorData.officeData.officeLong = office.long
            doctorData.officeData.officePhone = office.phoneNumber
            doctorData.officeData.officePictures = office.photoUrl
            doctorData.isDoctorInUserFavList = isFav
            result.push(doctorData);
        }
        res.json({message: "success operation getDoctorDataIfUserWant", result: result})
    } catch (e) {
        console.log("getDoctorDataIfUserWant ERROR: ", e.message)
        res.status(500).json({message: e.message})
    }
}



const userGiveRateToDoctor = async (req, res) => {
    try {
        const result = await doctorRepository.updateDoctorRate(req.params.doctorId, req.query.rate)
        res.json({message: "success userGiveRateToDoctor operation", result: result})

    } catch (e) {
        console.log("userGiveRateToDoctor ERROR: ", e)
        res.status(500).json({message: e.message})
    }
}


const showListOfDoctorsNotApproved = async (req, res) => {
    try {
        let result
        if (req.query.cityName) {
            result = await doctorRepository.filterPendingDoctorsByCity(req.cityName)
        } else {
            result = await doctorRepository.findDoctorsNotApproved()
        }
        res.json({message: "success showListOfDoctorsNotApproved operation", result: result})
    } catch (e) {
        console.log("showListOfDoctorsNotApproved ERROR: ", e)
        res.status(500).json({message: e.message})
    }
}


const approveDoctor = async (req, res) => {
    try {
        const result = await doctorRepository.approveAsDoctor(req.params.id)
        res.json({message: "success showListOfDoctorsNotApproved operation", result: result})
    } catch (e) {
        console.log("approveDoctor ERROR: ", e)
        res.status(500).json({message: e.message})
    }
}


const rejectDoctor = async (req, res) => {
    try {
        const result = await doctorRepository.rejectDoctor(req.params.id)
        res.json({message: "success rejectDoctor operation", result: result})
    } catch (e) {
        console.log("approveDoctor ERROR: ", e)
        res.status(500).json({message: e.message})
    }
}


router.get('/', getDoctorListController);
router.get('/id', getDoctorDataById);
router.get('/id/getDoctorDataIfUserWant',checkAccess.validateJwt, getDoctorDataIfUserWant);
router.get('/pending', checkAccess.validateJwt, showListOfDoctorsNotApproved);
router.get('/cities/offices', getOfficesInOrderOfCategoryAndCity);
router.post('/', checkAccess.validateJwt, checkAccess.checkRolesAccess, createUserAsDoctor);
router.put('/:phoneNumber', checkAccess.validateJwt, checkAccess.checkRolesAccess, updateDoctorData);
router.put('/:doctorId/rate', checkAccess.validateJwt, userGiveRateToDoctor);
router.put('/:id/approve', checkAccess.validateJwt, approveDoctor);
router.put('/:id/reject', checkAccess.validateJwt, rejectDoctor);


module.exports = router;
