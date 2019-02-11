require('dotenv').config();
const db = require('../src/db/db')

async function createDatabase() {
    try {
        await db.initDb();
        const doctorRepository = require('../src/repositories/doctor');
        const officeRepository = require('../src/repositories/office');
        const categoryRepository = require('../src/repositories/category');
        const secretaryRepository = require('../src/repositories/secretary');
        const statusRepository = require('../src/repositories/status');
        let status1={name: "active"}
        let status2={name: "deactivate"}
        let status3={name: "deleted"}
        let status4={name: "approved"}
        let status5= {name: "canceled"}
        let status6={name: "pending"}


        await statusRepository.createStatus(status1)
        await statusRepository.createStatus(status2)
        await statusRepository.createStatus(status3)
        await statusRepository.createStatus(status4)
        await statusRepository.createStatus(status5)
        await statusRepository.createStatus(status6)




        userSchema.create({phoneNumber: "09192506805", role: "admin"});
        userSchema.create({phoneNumber: "09192506806", role: "doctor"});
        userSchema.create({phoneNumber: "09192506807", role: "secretary"});
        userSchema.create({phoneNumber: "09192506808", role: "user"});


        let creatDoctorData = {
            phoneNumber: "09192506806",
            firstName: "ali",
            lastName: "alipoor",
            categoryId: 1,
            officeId: [1, 2, 3]
        }
        await doctorRepository.createDoctorUser(creatDoctorData)


        let createOfficeData = {
            phoneNumber: "02177317251",
            lat: 66.0,
            long: 40.0,
            address: "تهران امام حسین",
            secretaryId: 1,
            doctorId: 1,
        }
        await officeRepository.createNewOffice(createOfficeData)

        let dataCategory1 = {parentName: null, displayName: "درمانگران", name: "darmangaran"}
        let dataCategory2 = {parentName: "darmangaran", displayName: "دندانپزشکی", name: "dandanPezeshk"}
        let dataCategory3 = {parentName: "dandanPezeshk", displayName: "", name: "pezeshk motakhases"}
        let dataCategory4 = {parentName: "darmangaran", displayName: "", name: "pezeshkOmumi"}
        await categoryRepository.crateNewCategory(dataCategory1)
        await categoryRepository.crateNewCategory(dataCategory2)
        await categoryRepository.crateNewCategory(dataCategory3)
        await categoryRepository.crateNewCategory(dataCategory4)


        let createSecretaryData = {
            phoneNumber: "09192506807",
            firstName: "sara",
            lastName: "samavi",
            officeId: [1]
        }
        await secretaryRepository.createSecretaryUser(createSecretaryData)




    } catch (e) {
        console.log('Error create table seeder ', e.message)
    }

}

createDatabase().then()
// module.exports={createDatabase}
