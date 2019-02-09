const doctorSchema = require('../src/models/doctor')();
const userSchema = require('../src/models/user')();
const statusSchema = require('../src/models/status')();


const createDoctor = async () => {
    const user = await userSchema.findOne({where: {phoneNumber: "09192506806"}});
    const status = await statusSchema.findOn({where: {name:"approved"}})
    doctorSchema.create({
        userId: user.id,
        phoneNumber: "09192506806",
        firstName: "ali",
        lastName: "alipoor",
        categoryId: 1,
        officeId: [1, 2, 3],
        status:status.id
    })
}
module.exports = {createDoctor}