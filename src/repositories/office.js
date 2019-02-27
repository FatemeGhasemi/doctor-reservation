const officeSchema = require('../models/office')();
const doctorRepositry = require('../repositories/doctor')

const createNewOffice = async (data) => {
    return officeSchema.create({
        geom: {type: 'Point', coordinates: [data.lat, data.long]},
        doctorId: data.doctorId,
        secretaryId: data.secretaryId,
        lat: data.lat,
        long: data.long,
        phoneNumber: data.phoneNumber,
        address: data.address,
        type: data.type
    })
};


const updateOfficeData = async (id, data) => {
    return officeSchema.update({
            geom: {type: 'Point', coordinates: [data.lat, data.long]},
            doctorId: data.doctorId,
            secretaryId: data.secretaryId,
            lat: data.lat,
            long: data.long,
            phoneNumber: data.phoneNumber,
            address: data.address,
            type: data.type
        },
        {returning: true, where: {id: id}}
    )
};


const findOfficeById = async (id) => {
    return  officeSchema.findOne({where: {id: id}})
};


const changeOfficeStatus = async (id) => {
    const office = await findOfficeById(id);
    if (office.active) {
        return officeSchema.update({active: false}, {returning: true, where: {id: id}})
    } else {
        return officeSchema.update({active: true}, {returning: true, where: {id: id}})
    }
};


const returnAllOffices = async (offset = 0, limit = 10) => {
    return officeSchema.findAll(
        {offset: offset, limit: limit},
    )
};


const findDoctorByOfficeId = async (officeId) => {
    const office = await findOfficeById(officeId)
    const doctorId = office.doctorId
    const doctor = doctorRepositry.findDoctorById(doctorId)
    return doctor
}


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


module.exports = {
    createNewOffice,
    updateOfficeData,
    changeOfficeStatus,
    returnAllOffices,
    findDoctorByOfficeId,
    findOfficeById,
    findClosestPoints
};


