const insuranceSchema = require('../models/insurance')();


const findInsuranceById  = (id)=>{
    return insuranceSchema.findOne({where:{id:id}})
}


module.exports = {findInsuranceById}
