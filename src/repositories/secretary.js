const activateAsSecretary = async (id, officeId,) => {
//TODO should return activated secretary data
};


const updateSecretaryData = async (id, data) => {
//    TODO return updated data
};


const deactivateSecretary = async (id) => {
//    TODO return deactivated secretary
};


const searchSecretaryFullText = async (filter, begin = 0, total = 10) => {
//    TODO return secretary list
};


const createSecretaryUser = async (phoneNumber, firstName, lastName, categoryId, description = "", officeIds = []) => {
//    TODO return secretary data
};


module.exports = {
    activateAsSecretary,
    updateSecretaryData,
    deactivateSecretary,
    searchSecretaryFullText,
    createSecretaryUser
}