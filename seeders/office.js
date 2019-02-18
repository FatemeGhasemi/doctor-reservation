async function insertOffices() {
    // const officeRepository = require('../src/repositories/office');
    const officeSchema = require('../src/models/office')();

    const mockData = require('./office.json')
    for (let index = 0; index < mockData.length; index++) {
        const item = mockData[index]
        await officeSchema.create(item)
    }
    // officeSchema.create({
    //     geom: {type: 'Point', coordinates: [1.444, 2.666]},
    //     doctorId: 1,
    //     secretaryId: 1,
    //     lat: 1.444,
    //     long: 2.666,
    //     "phoneNumber": "02177317251",
    //     address: "تهران امام حسین",
    // })

}

module.exports = {insertOffices}

