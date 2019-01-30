const redis = require('../../db/redis');
const utils = require('../../utils/utils');
const sms = require('../../services/sms');

const sendOtpMessage = async (phoneNumber, message) => {
    return await sms.send(phoneNumber, message)
};


const isOtpValid = async (otp, phoneNumber) => {
    const redisOtp = await redis.getFromRedis(phoneNumber);
    if (redisOtp == otp) {
        return true
    } else return false
};


const generateOtp = async () => {
    return await utils.getRandomFourDigitNumber();

};


//this function integrate generateOtp function and sendOtpMessage function and handling otp service
const sendOtpHandler = async (phoneNumber) => {
    try {
        const otpCode = await generateOtp();
        await saveOtpCode(phoneNumber,otpCode)
        await sendOtpMessage(phoneNumber,otpCode)
        return otpCode
    } catch (e) {
        console.log("sendOtpHandler ERROR: ", e.message)
    }
};


const saveOtpCode = async (phoneNumber, otpCode) => {
    await redis.setInRedis(phoneNumber, otpCode, 15 * 60 * 60)
};


const deleteOtpCode = (phoneNumber) => {
    redis.removeFromRedis(phoneNumber)
};


module.exports = {sendOtpHandler, isOtpValid, deleteOtpCode,generateOtp};