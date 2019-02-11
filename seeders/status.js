
require('dotenv').config();
const db = require('../src/db/db')

db.initDb().then(() => {
    const statusSchema = require('../src/models/status')()

    statusSchema.create({name: "active"})
    statusSchema.create({name: "deactivate"})
    statusSchema.create({name: "deleted"})
    statusSchema.create({name: "approved"})
    statusSchema.create({name: "canceled"})
    statusSchema.create({name: "pending"})

});


// module.exports={createStatus}