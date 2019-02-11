async function insertSecretaries() {
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
}

module.exports = {insertSecretaries}