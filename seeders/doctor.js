async function insertDoctors(){
    let data = {
        phoneNumber: "09192506806",
        name: "ali alipoor",
        categoryId: 1,
        officeId: [1, 2, 3],
        status:"approved"
    }
    const doctorRepository = require('../src/repositories/doctor');
    await doctorRepository.createDoctorUser(data)
}

module.exports ={insertDoctors}






