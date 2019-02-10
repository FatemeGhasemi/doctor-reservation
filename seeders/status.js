// id: 1  name:"pending"
// id: 2  name:"active"
// id: 3  name:"deactivate"
// id: 4  name:"deleted"
// id: 5  name:"approved"
// id: 6  name:"canceled"
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