const doctorSchema = require('../models/doctor')();
const userSchema = require('../models/user')();
const userRepository = require('../repositories/user');
const cityRepository = require('../repositories/city');
const categoryRepository = require('../repositories/category')
const officeRepository = require('../repositories/office')


/**
 * create a doctor from a user
 * @param data
 * @returns {Promise<*>}
 */
const createDoctorUser = async (data) => {
    const user = await userRepository.findUserByPhoneNumber(data.phoneNumber)
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
            medicalSystemNumber: data.medicalSystemNumber
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


/**
 * return all doctors from db
 * @param offset
 * @param limit
 * @returns {Promise<*>}
 */
const getAllDoctors = async (offset = 0, limit = 10) => {
    return doctorSchema.findAll(
        {offset: offset, limit: limit},
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
        doctor.recommendedList.push(doctorData)
    }
    return doctorSchema.update({recommendedList: doctor.recommendedList}, {
        returning: true,
        where: {phoneNumber: phoneNumber}
    })
};


const removeDoctorFromRecommandList = async (phoneNumber, doctorData) => {
    let valid = []
    const doctor = await searchDoctorByPhoneNumber(phoneNumber)
    if (doctor.proprietary === true) {
        for (let i = 0; i < doctor.recommendedList.length; i++) {
            const favorite = user.recommendedList[i]
            if (favorite !== doctorData) {
                valid.push(favorite)
            }
        }
    }
    return doctorSchema.update({recommendedList: valid}, {returning: true, where: {phoneNumber: phoneNumber}})
};


const findDoctorByMedicalSystemNumber = async (medicalSystemNumber) => {
    return doctorSchema.findOne({where: {medicalSystemNumber: medicalSystemNumber}})
}



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
    findDoctorByMedicalSystemNumber
    // searchDoctorByName
}
