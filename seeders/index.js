require('dotenv').config();
const secretary = require('./secretary')
const status = require('./status')
const user = require('./user')
const doctor = require('./doctor')
const office = require('./office')

const category = require('./category')
const reserve = require('./reserve')
const reservation = require('./reservation')
const db = require('../src/db/db')
const initTables = require('../src/init-tables')

async function initDbAndSeed() {
    try {
        const sequilize = await db.getInstance()
        await initTables.createTables(sequilize, process.env.DROP_DB === 'true')
        /**
         * Be aware that order of insert data is important , user should be before than secretary and doctor
         */
        await secretary.insertSecretaries()
        await user.insertUsers()
        await office.insertOffices()
        await status.insertStatus()
        await category.insertCategorues()
        await doctor.insertDoctors()
        await reservation.insertReservation()
        await reserve.insertReserve()
    } catch (e) {
        console.log('Error init db and seeds ', e)

    }

}

initDbAndSeed().then(res => {
    console.log('Seed operation completed')
}).catch(err => {
    console.log('Error init db and seeds ', e)
})