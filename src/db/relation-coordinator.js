function initRelations() {
    const userSchema = require('../models/user')();
    const doctorSchema = require('../models/doctor')();
    const categorySchema = require('../models/category')();
    const secretarySchema = require('../models/secretary')();
    const officeSchema = require('../models/office')();
    const reservationSchema = require('../models/reservation')();
    doctorSchema.belongsTo(userSchema)
    secretarySchema.belongsTo(userSchema)

}

module.exports = {initRelations}