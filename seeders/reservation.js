async function insertReservation() {
    const reservationSchema = require('../src/models/reservation')()
    const mockData = require('./reservation.json')
    for (let index = 0; index < mockData.length; index++) {
        const item = mockData[index]
        await reservationSchema.create(item)
    }

}

module.exports = {insertReservation}