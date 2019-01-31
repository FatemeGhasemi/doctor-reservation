const jwtHelper = require('../services/athorization/jwt');

const checkAccess = async (req, res, next) => {
    try {
        const authorizationHeader = jwtHelper.removeBearer(req.header('Authorization'));
        const allowedPhoneNumber = jwtHelper.verifyJwt(authorizationHeader).phoneNumber;
        console.log("req.body.phoneNumber: ",req.body.phoneNumber)
        console.log("allowedPhoneNumber: ",allowedPhoneNumber)
        if (allowedPhoneNumber === req.params.phoneNumber) {
            next()
        } else {
           throw new Error( "unAuthorize")
        }
    }catch (e) {
        res.status(403).json({"message": e.message})
    }

};

module.exports={checkAccess};