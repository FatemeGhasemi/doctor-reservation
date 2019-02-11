require('dotenv').config();
const secretary = require('./secretary')
const status = require('./status')
const user = require('./user')
const doctor = require('./doctor')
const office = require('./office')

const category = require('./category')
const db = require('../src/db/db')
const initTables = require('../src/init-tables')

async function initDbAndSeed() {
    const sequilize = await db.getInstance()
    await initTables.createTables(sequilize, process.env.DROP_DB === 'true')
    // await  secretary.insertSecretaries()
    await status.insertStatus()
    await user.insertUsers()
    await doctor.insertDoctors()
    await office.insertOffices()
    await category.insertCategorues()

}

initDbAndSeed().then(res => {
    console.log('Seed operation completed')
}).catch(err => {
    console.log('Error init db and seeds ', e)
})