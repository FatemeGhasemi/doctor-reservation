const sendOtpMessage = async (phoneNumber, message) => {
//    TODO call a function that send sms
};


const isOtpValid = async (otp, phoneNumber) => {
    // TODO return true or false
};


const generateOtp = async (payload, expireTimeSecond) => {
    //TODO  return otpCode
};


//this function integrate generateOtp function and sendOtpMessage function and handling otp service
const sendOtpHandler = async (payload) => {
    // TODO return otpCode
};


const saveOtpCode = (phoneNumber, otpCode) => {
//    TODO save otp in key value pair by phone number key
};


const deletOtpcode = (phoneNumber) => {
//    TODO delete otp code and phone number key value pair after use code
};
