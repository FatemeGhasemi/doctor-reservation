require('dotenv').config();
const db = require('../src/db/db')

async function createDoctors() {
    try {
        await db.initDb()
        let data = {
            phoneNumber: "09192506806",
            firstName: "ali",
            lastName: "alipoor",
            categoryId: 1,
            officeId: [1, 2, 3]
        }
        const doctorRepository = require('../src/repositories/doctor');
        await doctorRepository.createDoctorUser(data)
    } catch (e) {
        console.log('Error create doctor seeder ', e)
    }

}

createDoctors()








