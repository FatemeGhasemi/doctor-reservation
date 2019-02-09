// id: 1  name:"pending"
// id: 2  name:"active"
// id: 3  name:"deactivate"
// id: 4  name:"deleted"
// id: 5  name:"approved"
// id: 6  name:"canceled"
const statusSchema = require('../src/models/status')();
const createStatus = async ()=>{
    statusSchema.create({name:"pending"})
    statusSchema.create({name:"active"})
    statusSchema.create({name:"deactivate"})
    statusSchema.create({name:"approved"})
    statusSchema.create({name:"canceled"})
};
createStatus().then()

module.exports={createStatus}