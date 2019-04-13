require('dotenv').config({
    path :'.env.seeders'
});
const secretary = require('./secretary')
const user = require('./user')
const doctor = require('./doctor')
const office = require('./office')

const category = require('./category')
const reserve = require('./reserve')
const insurance = require('./insuarance')
const reservation = require('./reservation')
const city = require('./city')
const advertise = require('./advertise')
const db = require('../src/db/db')
const initTables = require('../src/init-tables')
const favorite = require('./favorite')
const billing = require('./billing')
const comment = require('./comment')


async function initDbAndSeed() {
    try {
        const sequilize = await db.getInstance()
        await initTables.createTables(sequilize, process.env.DROP_DB === 'true')
        /**
         * Be aware that order of insert data is important , user should be before than secretary and doctor
         */
        await city.insertCity()
        await user.insertUsers()
        await insurance.insertInsurance()
        await office.insertOffices()
        await category.insertCategorues()
        await doctor.insertDoctors()
        await secretary.insertSecretaries()
        await reservation.insertReservation()
        await reserve.insertReserve()
        await advertise.insertAdvertise()
        await favorite.insertFavorite()
        await billing.insertBilling()
        await comment.insertComment()
    } catch (e) {
        console.log('Error init db and seeds ', e)

    }

}

initDbAndSeed().then(res => {
    console.log('Seed operation completed')
}).catch(err => {
    console.log('Error init db and seeds ', e)
})
