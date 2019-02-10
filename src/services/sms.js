const Promise = require('bluebird');
const kaveNegar = require('kavenegar');

const kaveNegarPromisifyApi= Promise.promisifyAll(kaveNegar.KavenegarApi({
        apikey: process.env.KAVE_NEGAR_API_KEY
    })
);

const send =  async (receptor,message)=> {
    return await kaveNegarPromisifyApi.SendAsync({
        message: message,
        sender: process.env.KAVE_NEGAR_SENDER_PHONE,
        receptor: receptor
    });
};



module.exports ={
    send
};