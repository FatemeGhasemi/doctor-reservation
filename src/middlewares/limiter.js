const rateLimit = require('express-rate-limit')

const otpRateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 6
});



module.exports = {otpRateLimiter}