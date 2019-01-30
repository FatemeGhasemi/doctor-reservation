const casbin = require('casbin');
const jwt = require('./jwt');

const checkRoleAccess = async (jwtToken, object, act) => {
    try {
        const enforcer = await casbin.newEnforcer('./configs/model.conf', './configs/policy.csv');
        let phoneNumber = jwt.verifyJwt(jwtToken).phoneNumber;
        return enforcer.enforce(phoneNumber, object, act)

    } catch (e) {
        console.log("checkRoleAccess ERROR: ", e.message)
    }
};


module.exports = {checkRoleAccess};