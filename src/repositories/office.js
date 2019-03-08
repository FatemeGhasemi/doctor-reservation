const officeSchema = require('../models/office')();
const doctorSchema = require('../models/doctor')();
const insuranceRepository = require('../repositories/insurance')


/**
 * create a new office
 * @param data
 * @returns {Promise<*>}
 */
const createNewOffice = async (data) => {
    return officeSchema.create({
        geom: {type: 'Point', coordinates: [data.lat, data.long]},
        doctorId: data.doctorId,
        secretaryId: data.secretaryId,
        lat: data.lat,
        long: data.long,
        phoneNumber: data.phoneNumber,
        address: data.address,
        type: data.type,
        insuranceId: data.insuranceId
    })
};


/**
 * update office data
 * @param id
 * @param data
 * @returns {Promise<*>}
 */
const updateOfficeData = async (id, data) => {
    return officeSchema.update({
            geom: {type: 'Point', coordinates: [data.lat, data.long]},
            doctorId: data.doctorId,
            secretaryId: data.secretaryId,
            lat: data.lat,
            long: data.long,
            phoneNumber: data.phoneNumber,
            address: data.address,
            type: data.type,
            insuranceId: data.insuranceId

        },
        {returning: true, where: {id: id}}
    )
};



/**
 * find a office by its id
 * @param id
 * @returns {Promise<*>}
 */
const findOfficeById = async (id) => {
    return officeSchema.findOne({where: {id: id}})
};



/**
 * change office
 * @param id
 * @returns {Promise<*>}
 */
const changeOfficeStatus = async (id) => {
    const office = await findOfficeById(id);
    if (office.active) {
        return officeSchema.update({active: false}, {returning: true, where: {id: id}})
    } else {
        return officeSchema.update({active: true}, {returning: true, where: {id: id}})
    }
};



/**
 * return all offices
 * @param offset
 * @param limit
 * @returns {Promise<*>}
 */
const returnAllOffices = async (offset = 0, limit = 10) => {
    return officeSchema.findAll(
        {offset: offset, limit: limit},
    )
};



/**
 * find a doctor by his/her own office id
 * @param officeId
 * @returns {Promise<*>}
 */
const findDoctorByOfficeId = async (officeId) => {
    const office = await findOfficeById(officeId)
    const doctorId = office.doctorId
    const doctor = await findDoctorById(doctorId)
    return doctor
}



/**
 * find closest office point to user
 * @param lng
 * @param latitude
 * @param distance
 * @returns {Promise<*>}
 */
const findClosestPoints = async (lng, latitude, distance) => {
    const sequelize = officeSchema.sequelize
    /**
     * @see {https://manuel-rauber.com/2016/01/08/using-geo-based-data-with-sequelizejs-utilizing-postgresql-and-ms-sql-server-in-node-js/}
     */
    const query = `
SELECT
    *
FROM
    offices
WHERE
    ST_Distance_Sphere(ST_MakePoint(:latitude, :longitude), "geom") < :maxDistance
`
    return sequelize.query(query, {
        replacements: {
            latitude: parseFloat(latitude),
            longitude: parseFloat(lng),
            maxDistance: distance
        },
        type: sequelize.QueryTypes.SELECT
    });
};



/**
 *
 * @param lng
 * @param latitude
 * @param distance
 * @param categoryId
 * @returns {Promise<Array>}
 */
const searchNearestSameCategoryOffice = async (lng, latitude, distance, categoryId) => {
    const allOffices = await findClosestPoints(lng, latitude, distance)
    let activeOffice = []
    for (let i = 0; i < allOffices.length; i++) {
        let data;
        const office = allOffices[i]
        const officeId = office.id
        const doctor = await findDoctorByOfficeId(officeId);
        const doctorCategory = doctor.categoryId
        const officeInsurances = await OfficeInsurance(officeId)
        if (categoryId === doctorCategory && office.active) {
            data = {}
            data.id = officeId
            data.doctorName = doctor.name
            data.doctorType = doctor.type
            data.lat = office.lat
            data.long = office.long
            data.address = office.address
            data.phoneNumber = office.phoneNumber
            data.officePhotoUrl = office.photoUrl
            data.officeInsurances = officeInsurances
        }
        activeOffice.push(data)
    }
    let result = []

    activeOffice.forEach(items => {
        if (items) {
            result.push(items)
        }
    })
    console.log("result: ", result)
    return result
}



/**
 *
 * @param id
 * @returns {Promise<*>}
 */
const findDoctorById = async (id) => {
    return doctorSchema.findOne({where: {id: id}})
};




const OfficeInsurance = async (officeId)=>{
    let listOfInsurance = []
    const office = await findOfficeById(officeId)
    const insuranceIds = office.insuranceId
    if ( insuranceIds === null || insuranceIds ===undefined) {
        listOfInsurance.push(null)
    }
    else{
        if (insuranceIds.length !== 0) {
            for (let i = 0; i < insuranceIds.length; i++) {
                const insuranceId = insuranceIds[i]
                const insurance = await insuranceRepository.findInsuranceById(insuranceId)
                const insuranceDisplayName = insurance.displayName
                listOfInsurance.push(insuranceDisplayName)
            }
        }
    }
    return listOfInsurance
}



/**
 *
 * @param officeId
 * @returns {Promise<void>}
 */
const returnOfficeData = async (officeId) => {
    let data = {}
    const office = await findOfficeById(officeId)
    const doctorId = office.doctorId
    const doctor = await findDoctorById(doctorId)
    const listOfInsurances = await OfficeInsurance(officeId)
    const officeAddress = office.address
    const officeLatitude = office.lastName
    const officeLongitude = office.long
    const officePhotoUrls = office.photoUrl
    const doctorName = doctor.name
    const doctorType = doctor.type
    const categoryId = doctor.categoryId
    data.officeAddress = officeAddress
    data.officelatitude = officeLatitude
    data.officeLongitude = officeLongitude
    data.officePhotoUrls = officePhotoUrls
    data.doctorName = doctorName
    data.doctorType = doctorType
    data.categoryId = categoryId
    data.insurance = listOfInsurances
    return data

}



/**
 *
 * @param secretaryId
 * @returns {*}
 */
const findOfficeBySecretaryId = (secretaryId) => {
    return officeSchema.findAll({where: {secretaryId: secretaryId}})
}



/**
 *
 * @param officeId
 * @param photoUrl
 * @returns {Promise<*>}
 */
const deletePhotoFromGallery = async (officeId, photoUrl) => {
    const office = await findOfficeById(officeId)
    let result = []
    const urls = office.photoUrl
    if (urls.length !== 0) {
        for (let i = 0; i < urls.length; i++) {
            let item = urls[i]
            if (item !== photoUrl) {
                result.push(item)
            }
        }
    }
    return officeSchema.update(
        {photoUrl: result},
        {returning: true, where: {id: officeId}}
    )
}



/**
 *
 * @param officeId
 * @param PhotoUrl
 * @returns {Promise<*>}
 */
const addPhotoToGallery = async (officeId, PhotoUrl) => {
    const office = await findOfficeById(officeId)
    const urls = office.photoUrl
    urls.push(PhotoUrl)
    return officeSchema.update(
        {photoUrl: urls},
        {returning: true, where: {id: officeId}}
    )
}


module.exports = {
    createNewOffice,
    updateOfficeData,
    changeOfficeStatus,
    returnAllOffices,
    findDoctorByOfficeId,
    findOfficeById,
    findClosestPoints,
    searchNearestSameCategoryOffice,
    returnOfficeData,
    findOfficeBySecretaryId,
    deletePhotoFromGallery,
    addPhotoToGallery
};


