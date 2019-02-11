require('dotenv').config();
const db = require('../src/db/db')

async function createSecretary() {
    try {
        await db.initDb()
        let data = {
            phoneNumber: "09192506807",
            firstName: "sara",
            lastName: "samavi",
            // lat: 66,
            // long: 40,
            // address:"تهران امام حسین",

            officeId: [1],
            status:"approved"
        }
        const secretaryRepository = require('../src/repositories/secretary');
        await secretaryRepository.createSecretaryUser(data)
    } catch (e) {
        console.log('Error create secretary seeder ', e)
    }

}

createSecretary()

