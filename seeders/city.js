async function insertCity() {
    const citySchema = require('../src/models/city')()
    const mockData = require('./city.json')
    for (let index = 0; index < mockData.length; index++) {
        const item = mockData[index]
        await citySchema.create(item)
    }
}

module.exports = {insertCity}
