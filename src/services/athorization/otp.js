const redis = require('../../db/redis');
const utils = require('../../utils/utils');
const sms = require('../../services/sms');

const sendOtpMessage = async (phoneNumber, message) => {
    return await sms.send(phoneNumber, message)
};


const isOtpValid = async (otp, phoneNumber) => {
    const redisOtp = await redis.getFromRedis(phoneNumber);
    return redisOtp === otp
};


const generateOtp = async () => {
    return await utils.getRandomFourDigitNumber();

};


//this function integrate generateOtp function and sendOtpMessage function and handling otp service
const sendOtpHandler = async (phoneNumber) => {
    try {
        if (process.env.IS_MOCK === 'true') {
            const otpCode = '1234';
            await saveOtpCode(phoneNumber,otpCode)
            return otpCode
        }

        const otpCode = await generateOtp();
        await saveOtpCode(phoneNumber,otpCode)
        const result = await sendOtpMessage(phoneNumber,otpCode)
        console.log('result of sending sms ', result)
        return otpCode
    } catch (e) {
        console.log("sendOtpHandler ERROR: ", e)
    }
};


const saveOtpCode = async (phoneNumber, otpCode) => {
    await redis.setInRedis(phoneNumber, otpCode, 15 * 60 * 60)
};


const deleteOtpCode = (phoneNumber) => {
    redis.removeFromRedis(phoneNumber)
};


module.exports = {sendOtpHandler, isOtpValid, deleteOtpCode,generateOtp};