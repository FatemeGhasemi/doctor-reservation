const billingSchema = require('../models/billing')();
const doctorRepository = require('../repositories/doctor');
const cityRepository = require('../repositories/city');
const officeRepository = require('../repositories/office');


const manageSmsPackCounter = async (doctorId) => {
    const doctor = await doctorRepository.findDoctorById(doctorId)
    let counter = doctor.smsPacketCounter

    const billings = await findAllOfUserPayments(doctorId)
    for (let i = 0; i < billings.length; i++) {
        const billing = billings[i]
        if (billing.status === 100 && billing.expired === false) {
             counter += billing.creditAmountInToman / billing.eachSmsCostInToman
        }
    }
    await doctorRepository.updateSmsCounter(doctorId,counter)
    await expiredInUseBilling(doctorId)
    let data = {}
    data.doctorName = doctor.name
    data.doctorId = doctorId
    data.smsCounterCredit = counter
    return data

}


const findAllOfUserPayments = (userId) => {
    return billingSchema.findAll({where: {userId: userId}})
}

const expiredInUseBilling = (userId)=>{
    return billingSchema.update({expired:true},{returning:true,where: {userId:userId}})
}

module.exports = {
    manageSmsPackCounter
}