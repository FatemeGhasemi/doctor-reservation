const redis = require('../../db/redis');

const sendOtpMessage = async (phoneNumber, message) => {
//    TODO call a function that send sms
};


const isOtpValid = async (otp, phoneNumber) => {
    const redisOtp = await redis.getFromRedis(phoneNumber);
    if (redisOtp == otp){return true}
    else return false
};


const generateOtp = async (payload, expireTimeSecond) => {
    //TODO  return otpCode
};


//this function integrate generateOtp function and sendOtpMessage function and handling otp service
const sendOtpHandler = async (phoneNumber) => {
    try {
        const otpCode = await generateOtp(phoneNumber, 15 * 60 * 60)
        saveOtpCode(phoneNumber, otpCode);
        await sendOtpMessage(phoneNumber, otpCode);
        return otpCode
    } catch (e) {
        console.log("sendOtpHandler ERROR: ", e.message)
    }
};


const saveOtpCode = (phoneNumber, otpCode) => {
    redis.setInRedis(phoneNumber, otpCode, 15 * 60 * 60)
};


const deletOtpcode = (phoneNumber) => {
    redis.removeFromRedis(phoneNumber)
};


module.exports = {sendOtpHandler}