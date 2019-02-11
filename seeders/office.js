async function insertOffices(){
    const officeRepository = require('../src/repositories/office');
    const mockData = require('./office.json')
    for (let index = 0; index < mockData.length; index++) {
        const item = mockData[index]
        await officeRepository.createNewOffice(item)
    }

}

module.exports = {insertOffices}