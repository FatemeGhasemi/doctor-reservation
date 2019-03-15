async function insertBilling() {
    const billingSchema = require('../src/models/billing')()
    const mockData = require('./billing.json')
    for (let index = 0; index < mockData.length; index++) {
        const item = mockData[index]
        await billingSchema.create({item})
    }

}

module.exports = {insertBilling}