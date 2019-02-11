async function insertStatus (){
    const statusSchema = require('../src/models/status')()

    const mockData = require('./status.json')
    for (let index = 0; index < mockData.length; index++) {
        const item = mockData[index]
        await statusSchema.create(item)

    }

}

module.exports={insertStatus}