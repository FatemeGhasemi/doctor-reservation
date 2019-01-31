
function initRelations() {
    const userSchema = require('../models/user')()
    const doctorSchema = require('../models/doctor')()
    doctorSchema.belongsTo(userSchema)
}

module.exports = {initRelations}