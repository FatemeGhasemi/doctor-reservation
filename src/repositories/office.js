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


const updateOfficeData = async (id,data) => {
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


const findOfficeById = async (id)=>{
    return officeSchema.findOne ({where: {id: id}})
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


const findDoctorByOfficeId = async (officeId)=>{
    const office = await findOfficeById(officeId)
    const doctorId = office.doctorId
    const doctor = doctorRepositry.findDoctorById(doctorId)
    return doctor
}




const findNearestsPoints = async (longitude, latitude)=>{
    const Sequelize = officeSchema.sequelize
    return officeSchema.findAll({
        attributes: {
            include: [
                [
                    Sequelize.fn(
                        'ST_Distance',
                        Sequelize.col('geom'),
                        Sequelize.fn('ST_MakePoint', longitude, latitude)
                    ),
                    'distance'
                ]
            ]
        },
        where: Sequelize.where(
            Sequelize.fn(
                'ST_DWithin',
                Sequelize.col('location'),
                Sequelize.fn('ST_MakePoint', longitude, latitude),
                process.env.REDIUS_DISTANCE
            ),
            true
        ),
        order: Sequelize.literal('distance ASC')
    });


};






module.exports={
    createNewOffice,
    updateOfficeData,
    changeOfficeStatus,
    returnAllOffices,
    findDoctorByOfficeId,
    findOfficeById,
    findNearestsPoints
};


