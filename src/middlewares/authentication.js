const jwtHelper = require('../services/athorization/jwt');
const authorization = require('../services/athorization/acl');
const userRepository = require('../repositories/user')
const doctorRepository = require("../repositories/doctor");
const officeRepository = require("../repositories/office");

const validateJwt = async (req, res, next) =>{
    try {
        const authorizationHeader = jwtHelper.removeBearer(req.header('Authorization'));
        const userData = jwtHelper.verifyJwt(authorizationHeader)
        res.locals.user = await userRepository.findUserByPhoneNumber(userData.phoneNumber)
        if ( res.locals.user) {
            next()
        } else {
            throw new Error("unAuthorize")
        }
    } catch (e) {
        res.status(403).json({"message": e.message})
    }
}

const checkAccessWithPhoneNumber = async (req, res, next) => {
    try {
        console.log("req.body.phoneNumber: ", req.params.phoneNumber);
        if (res.locals.user.phoneNumber === req.params.phoneNumber) {
            next()
        } else {
            throw new Error("unAuthorize")
        }
    } catch (e) {
        res.status(403).json({"message": e.message})
    }
};


const checkAccessWithPhoneNumberInOfficeRouter = async (req, res, next) => {
    try {
        const doctor = await officeRepository.findDoctorByOfficeId(req.params.id)
        if (res.locals.user.phoneNumber === doctor.phoneNumber) {
            next()
        } else {
            throw new Error("unAuthorize")
        }
    } catch (e) {
        res.status(403).json({"message": e.message})
    }
};




const checkRolesAccess = async (req, res, next) => {
    const act = req.method.toLowerCase();
    const obj = req.baseUrl.split('/')[3];
    const checkRoleAccess = await authorization.checkRoleAccess(res.locals.user.role, obj, act);
    console.log('checkRoleAccess ' , res.locals.user.role, obj, act,  checkRoleAccess)
    if (checkRoleAccess) {
        next()
    } else {
        res.status(403).json({"message": "unAuthorize"})
}
};


module.exports = {checkAccess: checkAccessWithPhoneNumber,checkRolesAccess, validateJwt,checkAccessWithPhoneNumberInOfficeRouter}