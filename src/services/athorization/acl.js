const casbin = require('casbin');
const jwtHelper = require('./jwt');
const userRepository = require('../../repositories/user')

const checkRoleAccess = async (jwtToken, object, act) => {
    try {
        const enforcer = await casbin.newEnforcer('./configs/model.conf', './configs/policy.csv');
        let phoneNumber = jwtHelper.verifyJwt(jwtToken).phoneNumber;
        const roll = userRepository.findUserByPhoneNumber(phoneNumber).roll;
        return enforcer.enforce(roll, object, act)

    } catch (e) {
        console.log("checkRoleAccess ERROR: ", e.message)
    }
};


module.exports = {checkRoleAccess};