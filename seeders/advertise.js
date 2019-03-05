async function insertAdvertise() {
    const advertiseSchema = require('../src/models/advertise')()
    const mockData = require('./advertise.json')
    for (let index = 0; index < mockData.length; index++) {
        const item = mockData[index]
        await advertiseSchema.create(item)
    }

}

module.exports = {insertAdvertise}
