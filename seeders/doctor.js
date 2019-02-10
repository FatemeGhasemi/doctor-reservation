require('dotenv').config();
const db = require('../src/db/db')



db.initDb().then(()=> {
    let data = {
        phoneNumber: "09192506806",
        firstName: "ali",
        lastName: "alipoor",
        categoryId: 1,
        officeId: [1, 2, 3]
    }

    db.initDb().then(()=> {
        const doctorRepository = require('../src/repositories/doctor');
        doctorRepository.createDoctorUser(data).then()

    });


});









