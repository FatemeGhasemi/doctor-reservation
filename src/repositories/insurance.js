const insuranceSchema = require('../models/insurance')();
const officeSchema = require('../models/office')();
const doctorRepository = require('../repositories/doctor')
const officeRepository = require('../repositories/office')
const cityRepository = require('../repositories/city')


const findInsuranceById = (id) => {
    return insuranceSchema.findOne({where: {id: id}})
}

const findInsuranceByName = (insuranceName) => {
    const insurance1 = insuranceSchema({where: {name: insuranceName}})
    const insurance2 = insuranceSchema({where: {displayName: insuranceName}})
    if (insurance1) {
        return insurance1
    }
    if (insurance2) {
        return insurance2
    }
}




const findOfficeByInsuranceNameAndGenderAndDoctorType = async (insuranceName, doctorType, gender, cityName) => {
    const doctors = await doctorRepository.findDoctorByType(doctorType)
    let result = []
    // let offices =

    for (let i = 0; i < doctors.length; i++) {
        const doctor = doctors[i]
        if (gender) {
            if (doctor.gender === gender) {
                const offices = doctor.officeId
                for (let j = 0; j < offices.length; j++) {
                    const office = offices[j]
                    const cityId = office.cityId
                    const city = await cityRepository.findCityById(cityId)
                    if (city.name === cityName || city.displayName === cityName) {
                        const insurances = await officeRepository.OfficeInsurance(office.id)
                        for (let k = 0; k < insurances.length; k++) {
                            const insurance = insurances[k]
                            if (insurance.name === insuranceName || insurance.displayName === insuranceName) {
                                const data = await officeRepository.returnOfficeData(office.id)
                                result.push(data)
                            }
                        }
                    }
                }
            }
        }
    }
    return result
}


module.exports = {findInsuranceById, findInsuranceByName, findOfficeByInsuranceNameAndGenderAndDoctorType}
