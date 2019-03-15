const insuranceSchema = require('../models/insurance')();
const officeSchema = require('../models/office')();
const doctorRepository = require('../repositories/doctor')


const findInsuranceById  = (id)=>{
    return insuranceSchema.findOne({where:{id:id}})
}

const findInsuranceByName = (insuranceName)=>{
    const insurance1 = insuranceSchema({where: {name:insuranceName}})
    const insurance2 = insuranceSchema({where: {displayName:insuranceName}})
    if(insurance1){
        return insurance1
    }
    if(insurance2){
        return insurance2
    }
}



const findOfficeByInsuranceNameAndGenderAndDoctorType = async (insuranceName,doctorType,gender)=>{
    const doctors = doctorRepository.findDoctorByType(doctorType)
    for (let i=0;i<doctors.length;i++){


    }



}




module.exports = {findInsuranceById,findInsuranceByName}
