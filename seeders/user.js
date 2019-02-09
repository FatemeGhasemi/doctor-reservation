const userSchema = require('../src/models/user')();
const statusSchema = require('../src/models/status')();


const createUser = async () => {
    const status = await statusSchema.findOn({where: {name:"approved"}})

    userSchema.create({phoneNumber: "09192506805", role: "user", statusId:status.id});
    userSchema.create({phoneNumber: "09192506806", role: "doctor", statusId: status.id});
    userSchema.create({phoneNumber: "09192506807", role: "secretary", statusId: status.id});
    userSchema.create({phoneNumber: "09192506808", role: "admin", statusId: status.id});
}

module.exports = {createUser}