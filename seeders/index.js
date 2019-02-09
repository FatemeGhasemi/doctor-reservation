const secretary = require('./secretary')
const status = require('./status')
const user = require('./user')
const doctor = require('./doctor')

const seedDb = async ()=> {
    await status.createStatus()
    // await user.createUser()
    // await doctor.createDoctor()
    // await secretary.createSecretary()
}

seedDb().then()