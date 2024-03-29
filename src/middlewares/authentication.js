const jwtHelper = require('../services/athorization/jwt');
const authorization = require('../services/athorization/acl');
const userRepository = require('../repositories/user')
const doctorRepository = require("../repositories/doctor");
const officeRepository = require("../repositories/office");
const reserveRepository = require('../repositories/reserve')
const secretaryRepository = require('../repositories/secretary')

const validateJwt = async (req, res, next) => {
    try {
        console.log("req:",req)
        if(req.header('Authorization') ===undefined|| req.header('Authorization') ===null){
            res.status(404).json({"message": "json web token is empty"})
        }
        else {
            const authorizationHeader = jwtHelper.removeBearer(req.header('Authorization'));
            const userData = jwtHelper.verifyJwt(authorizationHeader)
            res.locals.user = await userRepository.findUserByPhoneNumber(userData.phoneNumber)
            if (res.locals.user) {
                next()
            } else {
                throw new Error("unAuthorize")
            }
        }
    } catch (e) {
        res.status(403).json({"message": e.message})
    }
}

const checkAccessWithPhoneNumber = async (req, res, next) => {
    try {
        console.log("req.params.phoneNumber: ", req.params.phoneNumber);
        console.log("req.query.phoneNumber: ", req.query.phoneNumber);
        if (res.locals.user.phoneNumber === req.params.phoneNumber || res.locals.user.phoneNumber === req.query.phoneNumber) {
            next()
        }
    } catch (e) {
        res.status(403).json({"message": e.message})
    }
};

const checkAccessById = async (req, res, next) => {
    try {
        const user = await userRepository.findUserById(req.query.id)
        const phoneNumber = user.phoneNumber
        if (res.locals.user.phoneNumber === phoneNumber) {
            next()
        } else {
            throw new Error("unAuthorize")
        }

    } catch (e) {
        res.status(403).json({"message": e.message})
    }
}


const checkAccessWithPhoneNumberInOfficeRouter = async (req, res, next) => {
    try {
        const reserve = await reserveRepository.findReserveById(req.params.id)
        const doctorId = reserve.doctorId
        const doctor = doctorRepository.findDoctorById(doctorId)
        if (res.locals.user.phoneNumber === doctor.phoneNumber) {
            next()
        }
    } catch (e) {
        res.status(403).json({"message": e.message})
    }
};


const checkAccessWihPhoneNumberReserveRouter = async (req, res, next) => {
    try {
        const reserve = await reserveRepository.findReserveById(req.params.id);
        const userId = reserve.userId
        const doctorId = reserve.doctorId
        const secretaryId = reserve.secretaryId
        const doctor = await doctorRepository.findDoctorById(doctorId)
        const user = await userRepository.findUserById(userId)
        const secretary = await secretaryRepository.findSecretaryId(secretaryId)
        if (res.locals.user.phoneNumber === doctor.phoneNumber ||
            res.locals.user.phoneNumber === secretary.phoneNumber ||
            res.locals.user.phoneNumber === user.phoneNumber) {
            next()
        } else {
            res.status(403).json({"message": "unauthorized"})

        }
    } catch (e) {
        res.status(403).json({"message": e.message})
    }

}


const checkRolesAccess = async (req, res, next) => {
    try {

        const act = req.method.toLowerCase();
        const obj = req.baseUrl.split('/')[3];
        const checkRoleAccess = await authorization.checkRoleAccess(res.locals.user.role, obj, act);
        console.log('checkRoleAccess ', res.locals.user.role, obj, act, checkRoleAccess)
        if (checkRoleAccess) {
            next()
        }
    } catch (e) {
        res.status(403).json({"message": e.message})

    }
};


module.exports = {
    checkAccess: checkAccessWithPhoneNumber,
    checkRolesAccess,
    validateJwt,
    checkAccessWithPhoneNumberInOfficeRouter,
    checkAccessWihPhoneNumberReserveRouter,
    checkAccessById
}
