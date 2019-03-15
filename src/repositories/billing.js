const billingSchema = require('../models/billing')();
const doctorRepository = require('../repositories/doctor');
const cityRepository = require('../repositories/city');
const officeRepository = require('../repositories/office');


const chargeSmsPackCounter = async (doctorPhone) => {
    const doctor = await doctorRepository.searchDoctorByPhoneNumber(doctorPhone)
    let counter = doctor.smsPacketCounter
    if(!counter){
        counter = 0
    }

        let result=[]
    const billings = await findAllOfUserPayments(doctor.userId)
    for (let i = 0; i < billings.length; i++) {
        let data = {}
        const billing = billings[i]
        if (billing.status === "100" && billing.expired === false) {
             counter += billing.creditAmountInToman / billing.eachSmsCostInToman
            await doctorRepository.updateSmsCounter(doctor.id,counter)
            await expiredInUseBilling(doctor.userId)
            data.doctorName = doctor.name
            data.doctorId = doctor.id
            data.userId = doctor.userId
            data.smsCount = counter
        }else {
            data.message="no credit to charge"
        }
        result.push(data)
    }
    return result
}


const findAllOfUserPayments = async (userId) => {
    const bill = await billingSchema.findAll({
        where: {
            userId: userId
        }
    })
    return bill
}

const expiredInUseBilling = (userId)=>{
    return billingSchema.update({expired:true},{returning:true,where: {userId:userId}})
}



module.exports = {
    chargeSmsPackCounter
}