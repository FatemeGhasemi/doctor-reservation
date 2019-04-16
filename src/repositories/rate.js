const rateSchema = require('../models/rate')();
const doctorSchema = require('../models/doctor')();
const userRepository = require('../repositories/user');
const doctorRepository = require('../repositories/doctor');


const userRateDoctor = async (data) =>{
    if(1<=data.rate<=5) {
        await rateSchema.create(data)
        const doctor = await doctorRepository.findDoctorById(data.doctorId)
        const rate2 = doctor.rate
        const ratSum = rate2 + data.rate
        if (ratSum <= 5) {
            await doctorSchema.update({rate: data.rate}, {returning: true, where: {id: data.doctorId}})
        }
        if (ratSum > 5) {
            await doctorSchema.update({rate: ratSum/2}, {returning: true, where: {id: data.doctorId}})
        }
        const info = {}
        info.doctorId = data.doctorId
        info.doctorName = doctor.phoneNumber
        info.doctorAvatarUrl = doctor.avatarUrl
        info.doctorType = doctor.type
        info.rate = data.rate
        return data
    }
    else {
        throw new Error("rate should be in range 1 to 5")
    }
}


const listOfUsersRateDoctor = async (doctorId)=>{
    const res = []
    const rateDatas = await rateSchema.findAll({doctorId:doctorId})
    const doctor = await doctorRepository.findDoctorById(doctorId)
    for (let i=0;i<rateDatas.length;i++){
        const rateData = rateDatas[i]
        const userId = rateData.userId
        const rate = rateData.rate
        const user = await userRepository.findUserById(userId)
        const data = {}
        data.userId = user.id
        data.userFirstName = user.firstName
        data.userLastName = user.lastName
        data.userPhoneNumber = user.phoneNumber
        data.rate = rate
        data.doctorId = doctor.doctorId
        data.doctorName = doctor.phoneNumber
        data.doctorAvatarUrl = doctor.avatarUrl
        data.doctorType = doctor.type
        data.doctorCategoryId = doctor.categoryId
        res.push(data)
    }
    return res
}


const listOfDoctorsUserRate = async (userId)=>{
    const res = []
    const rateDatas = await rateSchema.findAll({userId:userId})
    const user = await userRepository.findUserById(userId)
    for (let i=0;i<rateDatas.length;i++){
        const rateData = rateDatas[i]
        const doctorId = rateData.doctorId
        const rate = rateData.rate
        const doctor = await doctorRepository.findDoctorById(doctorId)
        const data = {}
        data.userId = user.id
        data.userFirstName = user.firstName
        data.userLastName = user.lastName
        data.userPhoneNumber = user.phoneNumber
        data.rate = rate
        data.doctorId = doctor.doctorId
        data.doctorName = doctor.phoneNumber
        data.doctorAvatarUrl = doctor.avatarUrl
        data.doctorType = doctor.type
        data.doctorCategoryId = doctor.categoryId
        res.push(data)
    }
    return res
}


const listOfAllDoctorsAndRate =async ()=>{
    const res = []
    const rateDatas = await rateSchema.findAll({})
    for (let i=0;i<rateDatas.length;i++){
        const rateData = rateDatas[i]
        const doctorId = rateData.doctorId
        const userId = rateData.userId
        const rate = rateData.rate
        const doctor = await doctorRepository.findDoctorById(doctorId)
        const user = await userRepository.findUserById(userId)
        const data = {}
        data.userId = user.id
        data.userFirstName = user.firstName
        data.userLastName = user.lastName
        data.userPhoneNumber = user.phoneNumber
        data.rate = rate
        data.doctorId = doctor.doctorId
        data.doctorName = doctor.phoneNumber
        data.doctorAvatarUrl = doctor.avatarUrl
        data.doctorType = doctor.type
        data.doctorCategoryId = doctor.categoryId
        res.push(data)
    }
    return res
}


module.exports = {
    listOfDoctorsUserRate,
    listOfUsersRateDoctor,
    userRateDoctor,
    listOfAllDoctorsAndRate

}
