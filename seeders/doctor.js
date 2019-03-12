async function insertDoctors(){
    const doctorRepository = require('../src/repositories/doctor');
    const userRepository = require('../src/repositories/user');
    const doctorSchema = require('../src/models/doctor')();

    const mockData = require('./doctor.json')
    for (let index = 0; index < mockData.length; index++) {
        const item = mockData[index]
        let user;
        let userId;
        user = await userRepository.findUserByPhoneNumber(item.phoneNumber)
        if(user.id) {
            userId = user.id;
        }
        else {
            user= await userRepository.createUser(item.phoneNumber)
            userId = user.id;
        }
        await doctorSchema.create({
            userId: userId,
            phoneNumber: item.phoneNumber,
            name: item.name,
            categoryId: item.categoryId,
            description: item.description,
            officeId: item.officeId,
            type:item.type,
            secretaryId:item.secretaryId,
            nationalId:item.nationalId,
            field:item.field,
            grade:item.grade,
            province:item.province,
            city:item.city,
            avatarUrl:item.avatarUrl,
            rate:item.rate,
            status:item.status
        })

    }
}

module.exports ={insertDoctors}






