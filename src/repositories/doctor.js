const doctorSchema = require('../models/doctor')();
const userSchema = require('../models/user')();
const userRepository = require('../repositories/user');
const cityRepository = require('../repositories/city');
const categoryRepository = require('../repositories/category')
const officeRepository = require('../repositories/office')
const utils = require('../utils/utils')
const sms = require('../services/sms')


/**
 * create a doctor from a user
 * @param data
 * @returns {Promise<*>}
 */
const createDoctorUser = async (data) => {
    const user = await userRepository.findUserByPhoneNumber(data.phoneNumber)
    const doctorCode = utils.generateRandomString(4)
    if (user) {
        const userId = user.id;
        await userRepository.updateUserRole(data.phoneNumber, "doctor")
        const city = await cityRepository.findCityByName(data.cityName)
        const cityId = city.id
        console.log(data.categoryId)
        return doctorSchema.create({
            userId: userId,
            phoneNumber: data.phoneNumber,
            name: data.name,
            categoryId: data.categoryId,
            description: data.description,
            type: data.type,
            nationalId: data.nationalId,
            field: data.field,
            grade: data.grade,
            cityId: cityId,
            medicalSystemNumber: data.medicalSystemNumber,
            gender: data.gender,
            creditExpiredTime:data.creditExpiredTime,
            operationLicenseExpiredTime:data.operationLicenseExpiredTime,
            departmanType:data.departmanType,
            departmanName:data.departmanName,
            medicalCenterListOfDepartmanParts:data.medicalCenterListOfDepartmanParts,
            detectionCenterListOfDepartmanParts:data.detectionCenterListOfDepartmanParts,
            storeName:data.storeName,
            doctorCode: doctorCode


        })
    } else {
        throw new Error("user have to creat user account first")
    }
};


/**
 * find a doctor by his/her own office id
 * @param officeId
 * @returns {Promise<*>}
 */
const findDoctorByOfficeId = async (officeId) => {
    const office = await officeRepository.findOfficeById(officeId)
    const doctorId = office.doctorId
    const doctor = await doctorSchema.findOne({where: {id: doctorId}})
    return doctor
}


const findDoctorsByGender = async (gender) => {
    const doctors = await doctorSchema.findAll({where: {gender: gender}})
    return doctors
}


/**
 * admin approve a user to be a doctor
 * @param id
 * @returns {Promise<*>}
 */
const approveAsDoctor = async (id) => {
    userSchema.update({role: "doctor"},
        {returning: true, where: {id: id}}
    );
    return doctorSchema.update(
        {status: "approve"},
        {returning: true, where: {id: id}}
    )
};


/**
 * update a doctor profile data
 * @param phoneNumber
 * @param data
 * @returns {Promise<*>}
 */
const updateDoctorData = async (phoneNumber, data) => {
    return doctorSchema.update(
        {
            name: data.name,
            categoryId: data.categoryId,
            description: data.description,
            officeId: data.officeId,
            status: data.status,
            type: data.type,
            secretaryId: data.secretaryId
        },
        {returning: true, where: {phoneNumber: phoneNumber}}
    )
};


const updateDoctorRate = (doctorId, rate) => {
    if (0 <= rate <= 5) {
        return doctorSchema.update({rate: rate},
            {
                returning: true, where: {id: doctorId}
            })
    } else {
        throw new Error("rate should be between 0 and 5")
    }
}


/**
 * deactivate a doctor
 * @param id
 * @returns {Promise<*>}
 */
const deactivateDoctor = async (id) => {
    return doctorSchema.update(
        {status: "deactivate"},
        {returning: true, where: {id: id}}
    )
};


const rejectDoctor = async (id) => {
    return doctorSchema.update(
        {status: "reject"},
        {returning: true, where: {id: id}}
    )
};


/**
 * return all doctors from db
 * @param offset
 * @param limit
 * @returns {Promise<*>}
 */
const getAllDoctors = async () => {
    return doctorSchema.findAll(
        {},
    )
}


// const searchDoctorByName = async (name) => {
//     return doctorSchema.findOne({where: {name: name}})
// }


/**
 * find a list of doctor in same category
 * @param categoryId
 * @returns {Promise<*>}
 */
const searchDoctorByCategory = async (categoryId) => {
    const category = await categoryRepository.findCategoryById(categoryId)
    const categoryName = category.name
    const result = await categoryRepository.findCategoryByParentName(categoryName)
    if (result.length === 0) {
        return doctorSchema.findAll({
            where: {
                categoryId: categoryId
            }
        })
    } else {
        throw new Error("this is not available")
    }
};


/**
 *
 * @param categoryId
 * @param cityId
 * @returns {Promise<Array>}
 */
const searchDoctorOfficeByCategoryAndCity = async (categoryId, cityId) => {
    const doctors = await searchDoctorByCategory(categoryId)
    let wantedOffices = []
    let res = []
    if (doctors.length !== 0) {
        for (let i = 0; i < doctors.length; i++) {
            let data = {}
            const doctor = doctors[i]
            if (doctor.status === "approved") {
                const officeIds = doctor.officeId
                if (officeIds.length !== 0) {
                    for (let j = 0; j < officeIds.length; j++) {
                        const officeId = officeIds[j]
                        const office = await officeRepository.findOfficeById(officeId)
                        const officeCityId = office.cityId
                        if (officeCityId == cityId) {
                            data.doctorName = doctor.name
                            data.doctorType = doctor.type
                            data.doctorAvatarUrl = doctor.avatarUrl
                            data.DoctorRate = doctor.rate
                            data.address = office.address
                            data.latitude = office.lat
                            data.longitude = office.long
                            data.officePhotos = office.photoUrl
                            wantedOffices.push(data)
                        }
                    }
                }
            }
        }
    }
    wantedOffices.forEach(item => {
        if (item !== {}) {
            res.push(item)
        }
    });
    return res
};


/**
 * find a doctor by his/her id
 * @param id
 * @returns {Promise<*>}
 */
const findDoctorById = async (id) => {
    return doctorSchema.findOne({where: {id: id}})
};


const findDoctorByUserId = async (userId) => {
    return doctorSchema.findOne({where: {userId: userId}})
};


/**
 * find a doctor by his/her phone
 * @param phoneNumber
 * @returns {*}
 */
const searchDoctorByPhoneNumber = (phoneNumber) => {
    return doctorSchema.findOne({where: {phoneNumber: phoneNumber}})
};


const addDoctorToRecommandList = async (phoneNumber, doctorData) => {
    const doctor = await searchDoctorByPhoneNumber(phoneNumber)
    if (doctor.proprietary === true) {
        if (!doctor.recommendedList.includes(doctorData))
        doctor.recommendedList.push(doctorData)
    }
    let uniqueNames = uniq = [...new Set(doctor.recommendedList)];
    const doctorAdded = await doctorSchema.update({recommendedList: uniqueNames}, {
        returning: true,
        where: {phoneNumber: phoneNumber}
    })
    return doctorAdded[1]

};


const removeDoctorFromRecommandList = async (phoneNumber, doctorData) => {
    let valid = []
    const doctor = await searchDoctorByPhoneNumber(phoneNumber)
    if (doctor.proprietary === true) {
        for (let i = 0; i < doctor.recommendedList.length; i++) {
            const favorite = doctor.recommendedList[i]
            if (favorite !== doctorData) {
                valid.push(favorite)
            }
        }
    }
    const doctorRemoved = doctorSchema.update({recommendedList: valid}, {returning: true, where: {phoneNumber: phoneNumber}})
    return doctorRemoved[1]
};


const findDoctorByMedicalSystemNumber = async (medicalSystemNumber) => {
    return doctorSchema.findOne({where: {medicalSystemNumber: medicalSystemNumber}})
};


const getDoctorRecommandList = async (phoneNumber) => {
    let result = []
    const doctor = await searchDoctorByPhoneNumber(phoneNumber)
    const recommendedList = doctor.recommendedList
    for (let i = 0; i < recommendedList.length; i++) {
        let data = {}
        const doctorId = recommendedList[i]
        const doctor = await findDoctorById(doctorId)
        const officeIds = doctor.officeId
        for (let j = 0; j < officeIds.length; j++) {
            const officId = officeIds[j]
            const office = await officeRepository.findOfficeById(officId)
            data.doctorName = doctor.name
            data.doctorPhoneNumber = doctor.phoneNumber
            data.doctorPhoto = doctor.photoUrl
            data.doctorCategoryId = doctor.categoryId
            data.officeAddress = office.address
            data.officeLat = office.lat
            data.officeLong = office.long
            data.officePhone = office.phoneNumber
            data.officePhotoes = office.photoUrl
            data.officeId = officId
            result.push(data)
        }
    }
    return result
};


const deletePhotoFromDoctorDocument = async (phoneNumber, photoUrl) => {
    const doctor = await searchDoctorByPhoneNumber(phoneNumber)
    let result = []
    const urls = doctor.documentsPhotosUrl
    if (urls.length !== 0) {
        for (let i = 0; i < urls.length; i++) {
            let item = urls[i]
            if (item !== photoUrl) {
                result.push(item)
            }
        }
    }
    return doctorSchema.update(
        {documentsPhotosUrl: result},
        {returning: true, where: {phoneNumber: phoneNumber}}
    )
};


const addPhotoToDoctorDocument = async (phoneNumber, PhotoUrl) => {
    const doctor = await searchDoctorByPhoneNumber(phoneNumber)
    const urls = doctor.documentsPhotosUrl
    urls.push(PhotoUrl)
    return doctorSchema.update(
        {documentsPhotosUrl: urls},
        {returning: true, where: {phoneNumber: phoneNumber}}
    )
};


const minusDoctorSmsPackCounter = async (doctorId) => {
    const doctor = await findDoctorById(doctorId)
    const smsPackCounter = doctor.smsPackCounter - 1
    return doctorSchema.update({smsPackCounter: smsPackCounter}, {returning: true, where: {id: doctorId}})
};


const updateSmsCounter = async (doctorId, counter) => {
    doctorSchema.update({smsPackCounter: counter}, {returning: true, where: {id: doctorId}})
};


const findDoctorByType = (doctorType) => {
    return doctorSchema.findAll({where: {type: doctorType}})
};


const findDoctorGender = (gender) => {
    return doctorSchema.findAll({where: {gender: gender}})
};


const findDoctorByDoctorType = (doctorType) => {
    return doctorSchema.findAll({where: {type: doctorType}})
};


const findDoctorsNotApproved = () => {
    return doctorSchema.findAll({where: {status: "pending"}})
}

const filterPendingDoctorsByCity = async (cityName) => {
    let res = []
    const city = await cityRepository.findCityByName(cityName)
    const doctors = await findDoctorsNotApproved()
    for (let i = 0; i < doctors.length; i++) {
        const doctor = doctors[i]
        if (doctor.cityId === city.id) {
            res.push(doctor)
        }
    }
    return res
}


const sendProprietaryRequest = async (phoneNumber) => {
    const doctor = await searchDoctorByPhoneNumber(phoneNumber)
    if (doctor) {
        if (doctor.status === "approved") {
            if (!doctor.proprietary) {
                return doctorSchema.update({status: "pendingToBeProprietary"}, {
                    returning: true,
                    where: {phoneNumber: phoneNumber}
                })
            }
        } else {
            throw new Error("doctor should be approved first")
        }
    } else {
        throw new Error("doctor should be approved first")
    }
}


const acceptToBeProprietary = async (phoneNumber) => {
    const doctor = await searchDoctorByPhoneNumber(phoneNumber)
    if (doctor.status === "pendingToBeProprietary") {
        const codeGenerated = utils.getRandomInt(1000000, 9999999)
        await doctorSchema.update({
            status: "approved",
            proprietary: true,
            proprietaryAppCode: codeGenerated
        }, {returning: true, where: {phoneNumber: phoneNumber}})
        let message = " کاربر گرامی درخواست شما مبنی بر دریافت کد اپ اختصاصی در اپ سفید تایید گردید "
        message += "کد اپ شما :"
        message += codeGenerated
        await sms.send(phoneNumber, message)
    } else {
        throw new Error("doctor should request first")
    }
};

const listOfPendingTobeProprietaryDoctor = async () => {
    let res = []
    const doctors = await getAllDoctors()
    for (let i = 0; i < doctors.length; i++) {
        let data = {}
        const doctor = doctors[i]
        if (doctor.status === "pendingToBeProprietary") {
            data.doctorName = doctor.name
            data.doctorType = doctor.type
            data.doctorMedicalSystemNumber = doctor.medicalSystemNumber
            data.doctorPhone = doctor.phoneNumber
            data.doctorId = doctor.id
            res.push(data)
        }
    }
    return res
}


const listOfRejectTobeProprietaryDoctor = async () => {
    let res = []
    const doctors = await getAllDoctors()
    for (let i = 0; i < doctors.length; i++) {
        let data = {}
        const doctor = doctors[i]
        if (doctor.status === "approved") {
            if (doctor.proprietary === false) {
                data.doctorName = doctor.name
                data.doctorType = doctor.type
                data.doctorMedicalSystemNumber = doctor.medicalSystemNumber
                data.doctorPhone = doctor.phoneNumber
                data.doctorId = doctor.id
                res.push(data)
            }
        }
    }
    return res
}


const listOfApprovedTobeProprietaryDoctor = async () => {
    let res = []
    const doctors = await getAllDoctors()
    for (let i = 0; i < doctors.length; i++) {
        let data = {}
        const doctor = doctors[i]
        if (doctor.status === "approved") {
            if (doctor.proprietary === true) {
                data.doctorName = doctor.name
                data.doctorType = doctor.type
                data.doctorMedicalSystemNumber = doctor.medicalSystemNumber
                data.doctorPhone = doctor.phoneNumber
                data.doctorId = doctor.id
                res.push(data)
            }
        }
    }
    return res
}


const rejectToBeProprietary = async (phoneNumber) => {
    const doctor = await searchDoctorByPhoneNumber(phoneNumber)
    if (doctor.status === "pendingToBeProprietary") {
        await doctorSchema.update({status: "approved"}, {returning: true, where: {phoneNumber: phoneNumber}})
        await doctorSchema.update({proprietary: false}, {returning: true, where: {phoneNumber: phoneNumber}})
        let message = " کاربر گرامی متاسفانه درخواست شما مبنی بر دریافت کد اپ اختصاصی در اپ سفید تایید نشده "
        await sms.send(phoneNumber, message)
    } else {
        throw new Error("doctor should request first")
    }
};





module.exports = {
    approveAsDoctor,
    updateDoctorData,
    deactivateDoctor,
    searchDoctorByCategory,
    createDoctorUser,
    searchDoctorByPhoneNumber,
    getAllDoctors,
    findDoctorById,
    findDoctorByOfficeId,
    searchDoctorOfficeByCategoryAndCity,
    updateDoctorRate,
    addDoctorToRecommandList,
    removeDoctorFromRecommandList,
    findDoctorByMedicalSystemNumber,
    getDoctorRecommandList,
    deletePhotoFromDoctorDocument,
    addPhotoToDoctorDocument,
    minusDoctorSmsPackCounter,
    updateSmsCounter,
    findDoctorsByGender,
    findDoctorByUserId,
    findDoctorByType,
    // findDoctorGender,
    findDoctorByDoctorType,
    filterPendingDoctorsByCity,
    findDoctorsNotApproved,
    rejectDoctor,
    acceptToBeProprietary,
    sendProprietaryRequest,
    listOfPendingTobeProprietaryDoctor,
    rejectToBeProprietary,
    listOfRejectTobeProprietaryDoctor,
    listOfApprovedTobeProprietaryDoctor
}
