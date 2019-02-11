async function insertSecretaries() {
    const secretaryRepository = require('../src/repositories/secretary');
    const mockData = require('./secretary.json')
    for (let index = 0; index < mockData.length; index++) {
        const item = mockData[index]
        await secretaryRepository.createSecretaryUser(item)
    }
}

module.exports = {insertSecretaries}