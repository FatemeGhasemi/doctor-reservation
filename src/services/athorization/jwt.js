const jwt = require('jsonwebtoken');


/**
 *
 * @param phoneNumber
 * @returns {*}
 */
const jwtGenerator = (phoneNumber) => {
    return jwt.sign(
        phoneNumber,
        process.env.JWT_SECRET
    );
};


/**
 *
 * @param jwtToken
 * @returns {*}
 */
const verifyJwt = (jwtToken) => {
    try {
        return jwt.verify(jwtToken, process.env.JWT_SECRET);
    } catch (e) {
        console.log("verifyJwt ERROR: ", e.message)
    }
};


/**
 *
 * @param jwtToken
 * @returns {string}
 */
const removeBearer = (jwtToken) => {
    return jwtToken.split(' ')[1]
};

module.exports = {
    jwtGenerator,
    verifyJwt,
    removeBearer
};


