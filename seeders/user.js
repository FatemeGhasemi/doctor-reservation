


require('dotenv').config();
const db = require('../src/db/db')



db.initDb().then(()=> {
    const statusSchema = require('../src/models/status')();
    statusSchema.findOn({where: {name:"approved"}}).then(
        (status)=>{
            const userSchema = require('../src/models/user')();

            userSchema.create({phoneNumber: "09192506805", role: "user", statusId:status.id});
            userSchema.create({phoneNumber: "09192506806", role: "doctor", statusId: status.id});
            userSchema.create({phoneNumber: "09192506807", role: "secretary", statusId: status.id});
            userSchema.create({phoneNumber: "09192506808", role: "admin", statusId: status.id});

        }


    )



});
