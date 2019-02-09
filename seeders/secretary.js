const secretarySchema = require('../src/models/secretary')();
const userSchema = require('../src/models/user')();
const statusSchema = require('../src/models/status')();


const createSecretary = async () => {
    const user = await userSchema.findOne({where: {phoneNumber: "09192506807"}})
    const status = await statusSchema.findOn({where: {name:"approved"}})
    secretarySchema.create({
        userId: user.id,
        phoneNumber: "09192506807",
        firstName: "sara",
        lastName: "samavi",
        officeId: [1, 2, 3],
        statusId:status.id
    })
}
module.exports = {createSecretary}