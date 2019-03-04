
async function insertInsurance() {
    const insuranceShema = require('../src/models/insurance')()
    const mockData = require('./reservation.json')
    for (let index = 0; index < mockData.length; index++) {
        const item = mockData[index]
        await insuranceShema.create(item)
    }

}

module.exports = {insertInsurance}