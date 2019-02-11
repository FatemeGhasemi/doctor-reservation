async function insertDoctors(){
    const doctorRepository = require('../src/repositories/doctor');
    const mockData = require('./doctor.json')
    for (let index = 0; index < mockData.length; index++) {
        const item = mockData[index]
        await doctorRepository.createDoctorUser(item)

    }
}

module.exports ={insertDoctors}






