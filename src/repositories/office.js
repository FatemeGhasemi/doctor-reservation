const officeSchema = require('../models/office')();

const createNewOffice = async (data) => {
    return officeSchema.create({
        phoneNumber: data.phoneNumber,
        lat: data.lat,
        long: data.long,
        address: data.address,
        doctorId: data.doctorId,
        secretaryId: data.secretaryId,
        type: data.type
    })
};


const updateOfficeData = async (id,data) => {
    return officeSchema.update({
            phoneNumber: data.phoneNumber,
            lat: data.lat,
            long: data.long,
            address: data.address,
            doctorId: data.doctorId,
            secretaryId: data.secretaryId,
            type: data.type,
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


module.exports={
    createNewOffice,
    updateOfficeData,
    changeOfficeStatus,
    returnAllOffices
};


