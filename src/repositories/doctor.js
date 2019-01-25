const activateAsDoctor = async (id, officeId,) => {
//TODO should return activate doctor data
};


const updateDoctorData = async (id, data) => {
//    TODO return updated data
};


const deactivateDoctor = async (id) => {
//    TODO return deactivated user
};


const searchDoctorFullText = async (filter, begin = 0, total = 10) => {
//    TODO return doctor list
};


const searchDoctorByCategory = (categoryId, begin = 0, total = 10) => {
//    TODO return doctor list
}


const searchDoctorByPhoneNumber = (phoneNumber)=>{
//    TODO return doctor data
}


const createDoctorUser = async (phoneNumber, firstName, lastName, categoryId, description = "", officeIds = []) => {
//    TODO return doctor data
}

module.exports = {
    activateAsDoctor,
    updateDoctorData,
    deactivateDoctor,
    searchDoctorByCategory,
    createDoctorUser,
    searchDoctorFullText,
    searchDoctorByPhoneNumber
}