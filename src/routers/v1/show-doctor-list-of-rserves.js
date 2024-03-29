const express = require('express');
const router = express.Router();
const reservationRepository = require('../../repositories/reservation');
const officeRepository = require('../../repositories/office');
const secretaryRepository = require('../../repositories/secretary');
const doctorRepository = require('../../repositories/doctor');
const checkAccess = require('../../middlewares/authentication');





const showDoctorListOfFreeTimeThatNotReserved = async (req, res) => {
    try {
        let result = []
        const doctor = await doctorRepository.findDoctorById(req.query.id)
        const officeIds = doctor.officeId
        for (let i = 0; i < officeIds.length; i++) {
            const data = {}
            const freeTimes = await reservationRepository.findValidReservationCounterOfAnOfficeByOfficeId(officeIds[i])
            const office = await officeRepository.findOfficeById(officeIds[i])
            const officeAddress = office.address
            const officeLatitude = office.lat
            const officeLongitude = office.long
            const doctorName = doctor.name
            const doctorPhone = doctor.phoneNumber
            const doctorType = doctor.type
            const doctorPhoto = doctor.avatarUrl
            const officePhone = office.phoneNumber
            data.officeId = office.id
            data.officeAddress = officeAddress
            data.officeLatitude = officeLatitude
            data.officeLongitude = officeLongitude
            data.officePhone = officePhone
            data.officePhotoUrls = office.photoUrl
            data.doctorName = doctorName
            data.doctorPhone = doctorPhone
            data.doctorType = doctorType
            data.doctorPhoto = doctorPhoto
            data.doctorRate = doctor.rate

            data.times =[]
            if (freeTimes.length !== 0) {
                data.times = freeTimes
            }
            result.push(data)
        }
        res.json({message: "success showDoctorListOfReserves operation", result: result})
    } catch (e) {
        console.log("createReservation ERROR: ", e)
        res.status(500).json({message: "fail createReservation operation", result: e})
    }
}


router.get('/doctors', showDoctorListOfFreeTimeThatNotReserved);
module.exports = router;
