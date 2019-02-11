


require('dotenv').config();
const db = require('../src/db/db')



db.initDb().then(()=> {
            const userSchema = require('../src/models/user')();

            userSchema.create({phoneNumber: "09192506805", role: "admin",status:"active"});
            userSchema.create({phoneNumber: "09192506806", role: "doctor",status:"active"});
            userSchema.create({phoneNumber: "09192506807", role: "secretary",status:"active"});
            userSchema.create({phoneNumber: "09192506808", role: "user",status:"active"});
});
