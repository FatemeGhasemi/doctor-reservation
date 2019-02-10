function initRelations() {
    const userSchema = require('../models/user')();
    const doctorSchema = require('../models/doctor')();
    const categorySchema = require('../models/category')();
    const secretarySchema = require('../models/secretary')();
    const officeSchema = require('../models/office')();
    const reservationSchema = require('../models/reservation')();
    // doctorSchema.belongsTo(userSchema,{as:'User',foreignKey:{name:'userId'}})
    // secretarySchema.belongsTo(userSchema,{as:'User',foreignKey:{name:'userId'}})

}

module.exports = {initRelations}