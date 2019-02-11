async function insertCategorues() {
    const categorySchema = require('../src/models/category')()
    const mockData = require('./category.json')
    for (let index = 0; index < mockData.length; index++) {
        const item = mockData[index]
        await categorySchema.create(item)
    }

}

module.exports = {insertCategorues}