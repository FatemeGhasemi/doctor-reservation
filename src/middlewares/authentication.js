const jwtHelper = require('../services/athorization/jwt');

const checkAccess = async (req, res, next) => {
    const authorizationHeader = jwtHelper.removeBearer(req.header('Authorization'));
    const allowedPhoneNumber = jwtHelper.verifyJwt(authorizationHeader).phoneNumber;
    console.log("req.body.phoneNumber: ",req.body.phoneNumber)
    console.log("allowedPhoneNumber: ",allowedPhoneNumber)
    if (allowedPhoneNumber === req.body.phoneNumber) {
        next()
    } else {
        res.status(403).json({"message": "unAuthorize"})
    }
};

module.exports={checkAccess};