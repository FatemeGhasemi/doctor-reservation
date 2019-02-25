const axios = require('axios');

let process.env    = require('../config/production-consts').Zarinpal;
const MerchantID = process.env.ZARIN_PAL_MERCHANT_ID;

function buy(Amount, Description, CallbackURL, Email, Mobile) {
    return axios.post(`${process.env.ZARIN_PAL_BUY_URL}`, {
        MerchantID, Amount, Description, Email, Mobile, CallbackURL
    }, {
        "headers": {
            "Content-Type": "application/json"
        }
    })
        .then(result => {
            console.log('buy response : ' ,result.data);
            const status = result.data.Status;
            if (status === 100) {
                return Promise.resolve({
                    status,
                    authorization       : result.data.Authority,
                    startPayUrl         : `${process.env.ZARIN_PAL_START_PAY_URL}${result.data.Authority}`,
                    zarinGateStartPayUrl: `${process.env.ZARIN_PAL_START_PAY_URL}${result.data.Authority}${process.env.ZARIN_GATE}`
                })
            } else {
                return Promise.reject(result.data);
            }
        })
        .catch(err => {
            console.log('buy error : ', err);
            return Promise.reject(err);
        })
}

function verifyPayment(Amount, Authority) {
    return axios.post(`${process.env.ZARIN_PAL_VERIFICATION_PAYMENT_URL}`, {
        MerchantID, Amount, Authority
    })
        .then(result => {
            console.log('verify payment result data : ' ,result.data);
            let status = result.data.Status;
            let refId  = result.data.RefID;
            let isVerified ;
            if (status === 100) {
                isVerified = true;
            } else {
                isVerified = false
            }
            return {isVerified, refId};
        })
        .catch(err => {
            console.log('verify payment error : ', err);
            return Promise.reject(err)
        });
}

module.exports   = {
    buy,
    verifyPayment
};
