const casbin = require('casbin');


/**
 *
 * @param role
 * @param object
 * @param act
 * @returns {Promise<boolean>}
 */
const checkRoleAccess = async (role, object, act) => {
    try {
        const enforcer = await casbin.newEnforcer('./configs/model.conf', './configs/policy.csv');
        return enforcer.enforce(role, object, act)
    } catch (e) {
        console.log("checkRoleAccess ERROR: ", e.message)
    }
};


module.exports = {checkRoleAccess};