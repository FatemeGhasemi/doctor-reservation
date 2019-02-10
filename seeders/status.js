// id: 1  name:"pending"
// id: 2  name:"active"
// id: 3  name:"deactivate"
// id: 4  name:"deleted"
// id: 5  name:"approved"
// id: 6  name:"canceled"
require('dotenv').config();
const db = require('../src/db/db')


const feedStatus = async (statusSchema) => {
    try {
        statusSchema.create({name: "pending"})
        statusSchema.create({name: "active"})
        statusSchema.create({name: "deactivate"})
        statusSchema.create({name: "deleted"})
        statusSchema.create({name: "approved"})
        statusSchema.create({name: "canceled"})
    }catch (e) {
        console.log("feedStatus ERROR: ",e.message)
    }
}

const feedUser = async (userSchema) => {
    try {

        userSchema.create({phoneNumber: "09192506805", role: "user", statusId: status.id});
        userSchema.create({phoneNumber: "09192506806", role: "doctor", statusId: status.id});
        userSchema.create({phoneNumber: "09192506807", role: "secretary", statusId: status.id});
        userSchema.create({phoneNumber: "09192506808", role: "admin", statusId: status.id});
    }catch (e) {
        console.log("feedUser ERROR: ",e.message)

    }
}


db.initDb().then(() => {
    const statusSchema = require('../src/models/status')();
    feedStatus(statusSchema).then(
        ()=>{
            const userSchema = require('../src/models/user')();

            feedUser(userSchema).then()
        }
    )

    // const status =  statusSchema.findOn({where: {name:"approved"}})
    //
    // userSchema.create({phoneNumber: "09192506805", role: "user", statusId:status.id});
    // userSchema.create({phoneNumber: "09192506806", role: "doctor", statusId: status.id});
    // userSchema.create({phoneNumber: "09192506807", role: "secretary", statusId: status.id});
    // userSchema.create({phoneNumber: "09192506808", role: "admin", statusId: status.id});


});


// module.exports={createStatus}