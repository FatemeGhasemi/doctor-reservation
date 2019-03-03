
async function insertReservation() {
    const reservationSchema = require('../src/models/reservation')()
    const reservationRepository = require('../src/repositories/reservation');
    const mockData = require('./reservation.json')
    for (let index = 0; index < mockData.length; index++) {
        const item = mockData[index]
        await reservationRepository.creatReservation(item)
    }

}

module.exports = {insertReservation}
