const jwt = require('jsonwebtoken');


const jwtGenerator = ({payload}) => {
    return jwt.sign(
        {
            ...payload,
            algorithm: process.env.JWT_ALGORITHM
        },
        process.env.JWT_SECRET
    );
};

const verifyJwt = (jwtToken) => {
    try {
        return jwt.verify(jwtToken, process.env.JWT_SECRET);
    } catch (e) {
        console.log("verifyJwt ERROR: ", e.message)
    }
};


const removeBearer = (jwtToken) => {
    return jwtToken.split(' ')[1]

};

module.exports = {
    jwtGenerator,
    verifyJwt,
    removeBearer
};


