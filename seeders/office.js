async function insertOffices(){
    let data = {
        phoneNumber: "02177317251",
        lat: 66.0,
        long: 40.0,
        address:"تهران امام حسین",
        secretaryId:1,
        doctorId:1,
    }
    const officeRepository = require('../src/repositories/office');
    await officeRepository.createNewOffice(data)
}

module.exports = {insertOffices}