async function insertReserve() {
    const reserveSchema = require('../src/models/reserve')()
    const mockData = require('./reserve.json')
    for (let index = 0; index < mockData.length; index++) {
        const item = mockData[index]
        await reserveSchema.create(item)
    }

}

module.exports = {insertReserve}