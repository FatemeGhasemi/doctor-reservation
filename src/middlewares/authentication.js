const jwtHelper = require('../services/athorization/jwt');
const authorization = require('../services/athorization/acl');

const checkAccess = async (req, res, next) => {
    try {
        const authorizationHeader = jwtHelper.removeBearer(req.header('Authorization'));
        const allowedPhoneNumber = jwtHelper.verifyJwt(authorizationHeader).phoneNumber;
        console.log("req.body.phoneNumber: ", req.body.phoneNumber);
        console.log("allowedPhoneNumber: ", allowedPhoneNumber);
        if (allowedPhoneNumber === req.body.phoneNumber) {
            next()
        } else {
            throw new Error("unAuthorize")
        }
    } catch (e) {
        res.status(403).json({"message": e.message})
    }
};


const checkRolesAccess = async (req, res, next) => {
    const authorizationHeader = jwtHelper.removeBearer(req.header('Authorization'));
    const act = req.method.toLowerCase();
    const obj = req.baseUrl.split('/')[3];
    const checkRoleAccess = await authorization.checkRoleAccess(authorizationHeader, obj, act);
    if (checkRoleAccess) {
        next()
    } else {
        res.status(403).json({"message": "unAuthorize"})
}
};


module.exports = {checkAccess,checkRolesAccess}