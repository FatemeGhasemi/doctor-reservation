const userSchema = require('../models/user')();
const doctorSchema = require('../models/doctor')();
const cityRepository = require('../repositories/city');
const officeRepository = require('../repositories/office');


/**
 *
 * @param phoneNumber
 * @returns {Promise<*>}
 */
const findUserByPhoneNumber = async (phoneNumber) => {
    return userSchema.findOne({where: {phoneNumber: phoneNumber}})
};


/**
 *
 * @param id
 * @returns {Promise<*>}
 */
const findUserById = async (id) => {
    return userSchema.findOne({where: {id: id}})
};


/**
 *
 * @param phoneNumber
 * @returns {Promise<*>}
 */
const createUser = async (phoneNumber) => {
    return userSchema.create({phoneNumber: phoneNumber})
};


/**
 *
 * @param phoneNumber
 * @returns {Promise<*>}
 */
const createUserTobeSecretary = async (phoneNumber) => {
    return userSchema.create({phoneNumber: phoneNumber, role: "secretary", status: "active"})
};


/**
 *
 * @param phoneNumber
 * @param data
 * @returns {Promise<*>}
 */
const updateUser = async (phoneNumber, data) => {
    const city = cityRepository.findCityByName(data.cityName)
    const cityId = city.id
    return userSchema.update(
        {
            firstName: data.firstName,
            lastName: data.lastName,
            avatarUrl: data.avatarUrl,
            role: data.role,
            status: data.status,
            officeId: data.officeId,
            cityId: cityId
        },
        {returning: true, where: {phoneNumber: phoneNumber}}
    )
};


const updateUserRole = async (phoneNumber, role) => {
    return userSchema.update({role: role}, {returning: true, where: {phoneNumber: phoneNumber}})
}


/**
 *
 * @param phoneNumber
 * @returns {Promise<string|User.role|{type, defaultValue}|RTCDtlsRole|RTCIceRole>}
 */
const getUserRoleByPhoneNumber = async (phoneNumber) => {
    const user = await findUserByPhoneNumber(phoneNumber);
    return user.role
};


/**
 *
 * @param phoneNumber
 * @returns {Promise<*>}
 */
const activateUser = async (phoneNumber) => {

    return userSchema.update(
        {status: "active"},
        {returning: true, where: {phoneNumber: phoneNumber}}
    )
};


/**
 *
 * @param phoneNumber
 * @returns {Promise<*>}
 */
const deactivateUser = async (phoneNumber) => {
    return userSchema.update(
        {status: "deactivate"},
        {returning: true, where: {phoneNumber: phoneNumber}}
    )
};


const getAllUsers = async () => {
    return userSchema.findAll({})
}


const getUsersInCity = async (city) => {
    const cityData = await cityRepository.findCityByName(city)
    return userSchema.findAll({where: {cityId: cityData.id}})
}


const addFavorite = async (phoneNumber, doctorId) => {
    let valid = []
    const user = await findUserByPhoneNumber(phoneNumber)
    for (let i = 0; i < user.favoriteList.length; i++) {
        const favorite = user.favoriteList[i]
        if (favorite !== doctorId) {
            valid.push(favorite)
        }
    }
    valid.push(doctorId)

    return userSchema.update({favoriteList: valid}, {returning: true, where: {phoneNumber: phoneNumber}})
};


const removeFavorite = async (phoneNumber, doctorId) => {
    let valid = []
    const user = await findUserByPhoneNumber(phoneNumber)
    for (let i = 0; i < user.favoriteList.length; i++) {
        const favorite = user.favoriteList[i]
        if (favorite !== doctorId) {
            valid.push(favorite)
        }
    }
    return userSchema.update({favoriteList: valid}, {returning: true, where: {phoneNumber: phoneNumber}})
};


const getListOfFavorite = async (phoneNumber) => {
    let result = []
    const user = await findUserByPhoneNumber(phoneNumber)
    const favoriteList = user.favoriteList
    for (let i = 0; i < favoriteList.length; i++) {
        let data = {}
        const doctorId = favoriteList[i]
        const doctor = await doctorSchema.findOne({where: {id: doctorId}})
        // const officeIds = doctor.officeId
        // for (let j = 0; j < officeIds.length; j++) {
        //     const officId = officeIds[j]
        // const office = await officeRepository.findOfficeById(officId)
        data.doctorName = doctor.name
        data.doctorPhoneNumber = doctor.phoneNumber
        data.doctorPhoto = doctor.photoUrl
        data.doctorId = doctor.id
        data.doctorType = doctor.type
        // data.officeAddress = office.address
        // data.officeLat = office.lat
        // data.officeLong = office.long
        // data.officePhone = office.phoneNumber
        // data.officePhotoes = office.photoUrl
        result.push(data)
        // }
    }
    return result
};


const addAvatarUrl = async (phoneNumber, photoUrl) => {
    userSchema.update({avatarUrl: photoUrl}, {returning: true, where: {phoneNumber: phoneNumber}})
};


const findDoctorByProprietaryCode = (proprietaryCode) => {
    return doctorSchema.findOne({where: {proprietaryAppCode: proprietaryCode}})
}


const findDoctorById = (id) => {
    return doctorSchema.findOne({where: {id: id}})
}


const findDoctorByUserId = (userId) => {
    return doctorSchema.findOne({where: {userId: userId}})
}


const addDoctorToProprietaryAppList = async (proprietaryCode, ownPhoneNumber) => {
    const doctor = await findDoctorByProprietaryCode(proprietaryCode)
    const user = await findUserByPhoneNumber(ownPhoneNumber)
    let userProprietaryAppList = user.proprietaryAppList
    if (doctor.proprietary === true) {
        if (!user.proprietaryAppList.includes(doctor.id)) {
            if (doctor.status === "approved") {
                userProprietaryAppList.push(doctor.id)
            }
        }
    }
    return userSchema.update({proprietaryAppList: userProprietaryAppList}, {
        returning: true,
        where: {phoneNumber: ownPhoneNumber}
    })
};


const removeDoctorFromProprietaryAppList = async (proprietaryCode, ownPhoneNumber) => {
    let res = []
    const doctor = await findDoctorByProprietaryCode(proprietaryCode)
    const user = await findUserByPhoneNumber(ownPhoneNumber)
    let userProprietaryAppList = user.proprietaryAppList
    userProprietaryAppList.forEach(item => {
        if (item !== doctor.id) {
            res.push(item)
        }
    })

    return userSchema.update({proprietaryAppList: res}, {
        returning: true,
        where: {phoneNumber: ownPhoneNumber}
    })
};


const searchDoctorByPhoneNumber = (phoneNumber) => {
    return doctorSchema.findOne({where: {phoneNumber: phoneNumber}})
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


const getListOfUserProprietaryAppList = async (phoneNumber) => {
    const user = await findUserByPhoneNumber(phoneNumber)
    let result = []
    let userProprietaryAppList = user.proprietaryAppList
    if (user.role === "doctor") {
        const self = await findDoctorByUserId(user.id)
        userProprietaryAppList.push(self.id)
    }
    for (let i = 0; i < userProprietaryAppList.length; i++) {
        let data = {}
        const doctorId = userProprietaryAppList[i]
        const doctor = await findDoctorById(doctorId)
        const recommendList = await getDoctorRecommandList(doctor.phoneNumber)
        data.doctorId = doctorId
        data.doctorName = doctor.name
        data.doctorType = doctor.type
        data.doctorCategoryId = doctor.categoryId
        data.getDoctorRecommandList = recommendList
        data.doctorAvatarUrl = doctor.avatarUrl
        data.doctorProprietaryAppCode = doctor.proprietaryAppCode
        result.push(data)
    }
    return result
}


module.exports = {
    activateUser,
    createUser,
    updateUser,
    deactivateUser,
    findUserByPhoneNumber,
    findUserById,
    getUserRoleByPhoneNumber,
    getAllUsers,
    createUserTobeSecretary,
    updateUserRole,
//     searchUserFullText,
    addFavorite,
    removeFavorite,
    getListOfFavorite,
    addAvatarUrl,
    getUsersInCity,
    getListOfUserProprietaryAppList,
    addDoctorToProprietaryAppList,
    removeDoctorFromProprietaryAppList
};


