async function insertUsers() {
    const userSchema = require('../src/models/user')();
    const mockData = require('./user.json')
    for (let index = 0; index < mockData.length; index++) {
        const item = mockData[index]
        await userSchema.create(item)
    }

}

module.exports = {insertUsers}