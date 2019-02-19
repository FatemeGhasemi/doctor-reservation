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
    return officeSchema.findOne({where: {id: id}})
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


const findClosestPoints = async (lng, latitude) => {
    try {
        const sequelize = officeSchema.sequelize
        return officeSchema
            .findAll({
            attributes: [[sequelize.literal("6371 * acos(cos(radians(" + latitude + ")) * cos(radians(lat)) * cos(radians(" + lng + ") - radians(long)) + sin(radians(" + latitude + ")) * sin(radians(lat)))"), 'distance']],
            order: sequelize.col('distance'),
            limit: 10
        });

        //     .findAll({
        //     attributes: [[sequelize.fn('POW', sequelize.fn('ABS', sequelize.literal("lat-" + lat)), 2), 'x1'],
        //         [sequelize.fn('POW', sequelize.fn('ABS', sequelize.literal("long-" + lng)), 2), 'x2']],
        //     order: sequelize.fn('SQRT', sequelize.literal('x2+x1')),
        //     limit: 10
        // });
    } catch (e) {
        console.log("findClosestPoints ERROR: ", e.stack)
    }
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


