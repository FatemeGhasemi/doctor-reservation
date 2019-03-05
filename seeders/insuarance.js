
async function insertInsurance() {
    const insuranceSchema = require('../src/models/insurance')()
    const mockData = require('./insurance.json')
    for (let index = 0; index < mockData.length; index++) {
        const item = mockData[index]
        await insuranceSchema.create({name:item.name,displayName:item.displayName})
    }
}

module.exports = {insertInsurance}
