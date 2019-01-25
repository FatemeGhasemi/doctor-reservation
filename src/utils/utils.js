// this function generate four digit number by node math library for generateOtp function
const getRandomFourDigitNumber= ()=> {
    return Math.floor(1000 + Math.random() * 9000);
};

module.exports={getRandomFourDigitNumber}