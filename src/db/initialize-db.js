const userSchema = require('../models/user');
const category = require('../models/category');
const office = require('../models/office');
const reservation = require('../models/reservation');
const doctor = require('../models/doctor');

const tablesCreator = async () => {
    try {
        await userSchema.userSchema()
        await doctor.doctorSchema()
        await reservation.reservationSchema()
        await office.officeSchema()
        await category.categorySchema()
    }catch (e) {
        console.log("tablesCreator ERROR:",e.message)
    }
};
module.exports = {tablesCreator}