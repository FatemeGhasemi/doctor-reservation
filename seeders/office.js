require('dotenv').config();
const db = require('../src/db/db')

async function createOffice() {
    try {
        await db.initDb()
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
    } catch (e) {
        console.log('Error create office seeder ', e)
    }

}

createOffice()