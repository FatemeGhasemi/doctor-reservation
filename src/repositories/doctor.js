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
    const userId=user.id;
    const city = await cityRepository.findCityByName(data.cityName)
    const cityId = city.id
    return doctorSchema.create({
        userId: userId,
        phoneNumber: data.phoneNumber,
        name: data.name,
        categoryId: data.categoryId,
        description: data.description,
        type:data.type,
        nationalId:data.nationalId,
        field:data.field,
        grade:data.grade,
        province:data.province,
        cityId:cityId,
    })
};




/**
 * find a doctor by his/her own office id
 * @param officeId
 * @returns {Promise<*>}
 */
const findDoctorByOfficeId = async (officeId) => {
    const office = await officeRepository.findOfficeById(officeId)
    const doctorId = office.doctorId
    const doctor = await doctorRepository.findDoctorById(doctorId)
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
            type:data.type,
            secretaryId: data.secretaryId
        },
        {returning: true, where: {phoneNumber: phoneNumber}}
    )
};


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
    if(result.length ===0) {
        return doctorSchema.findAll({
            where: {
                categoryId: categoryId
            }
        })
    }
    else {
        throw new Error("this is not available")
    }
};


const searchDoctorOfficeByCategoryAndCity = async (categoryId, cityId)=>{
    const doctors = await searchDoctorByCategory(categoryId)
    let wantedOffices = []
    let res = []
    if (doctors.length!==0){
        for (let i=0;i<doctors.length;i++){
            let data = {}
            const doctor = doctors[i]
            const officeIds = doctor.officeId
            if(officeIds.length !== 0){
                for(let j = 0;j<officeIds.length;j++){
                    const officeId = officeIds[j]
                    const office =await officeRepository.findOfficeById(officeId)
                    const officeCityId = office.cityId
                    if(officeCityId == cityId){
                        data.doctorName = doctor.name
                        data.doctorType = doctor.type
                        data.address = office.address
                        data.latitude = office.lat
                        data.longitude = office.long
                        wantedOffices.push(data)

                    }
                }
            }

        }
    }
    wantedOffices.forEach(item=>{
        if(item !=={}){
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
    searchDoctorOfficeByCategoryAndCity
    // searchDoctorByName
}
