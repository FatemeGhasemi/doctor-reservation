const insuranceSchema = require('../models/insurance')();
const officeSchema = require('../models/office')();
const doctorRepository = require('../repositories/doctor')
const officeRepository = require('../repositories/office')
const cityRepository = require('../repositories/city')


const findInsuranceById = (id) => {
    return insuranceSchema.findOne({where: {id: id}})
}

const findInsuranceByName = async (insuranceName) => {
    const insurance1 = await insuranceSchema.findAll({where: {name: insuranceName}})
    const insurance2 = await insuranceSchema.findAll({where: {displayName: insuranceName}})
    if (insurance1) {
        return insurance1
    }
    if (insurance2) {
        return insurance2
    }
}




const findOfficeByInsuranceNameAndGender = async (insuranceName, gender, cityName) => {

    const doctors = await doctorRepository.findDoctorsByGender(gender)
    let result = []
    // // let offices =
    //
    for (let i = 0; i < doctors.length; i++) {
        const doctor = doctors[i]
                const officeIds = doctor.officeId
                for (let j = 0; j < officeIds.length; j++) {
                    const officeId = officeIds[j]
                    const office = await officeRepository.findOfficeById(officeId)
                    const cityId = office.cityId
                    const city = await cityRepository.findCityById(cityId)
                    if (city.name === cityName || city.displayName === cityName) {
                        const insurances = await officeRepository.OfficeInsurance(office.id)
                        for (let k = 0; k < insurances.length; k++) {
                            const insurance = insurances[k]
                            const insuranceNamex = await insuranceSchema.findOne({where:{displayName: insurance}})
                            const insuranceNamexx = insuranceNamex.name
                            if (insuranceNamexx === insuranceName) {
                                const data = await officeRepository.returnDoctorData(doctor.id)
                                result.push(data)
                            }
                        }
                    }
                }

    }
    return result
}


module.exports = {findInsuranceById, findInsuranceByName, findOfficeByInsuranceNameAndGender}
