const activateAsDoctor = async (id, officeId,) => {
//TODO should return created new doctor
};


const updateDoctorData = async (id, data) => {
//    TODO return updated data
};


const deactivateDoctor = async (id) => {
//    TODO return deactivated user
};


const searchDoctorFullText = async (filter) => {
//    TODO return doctor list
};


const searchDoctorByCategory = (categoryId, begin = 0, total = 10) => {
//    TODO return doctor list
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
    searchDoctorFullText
}