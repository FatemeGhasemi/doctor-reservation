const createUser = async (phoneNumber, firstName, lastName) => {
//TODO should return created user
};


const updateUser = async (phoneNumber, data) => {
//    TODO return updated user
};


const searchUserFullText = async (filter) => {
//    TODO return  user list
};


const activateUser = async (phoneNumber) => {
//    TODO return activated user
};


const deactivateUser = async (phoneNumber) => {
//    TODO return deactivated user
};


const addFavorite = (phoneNumber, data) => {
//    TODO return favorite data
};


const removeFavorite = (phoneNumber, data) => {
//    TODO return favorite data
};


module.exports = {
    activateUser,
    createUser,
    updateUser,
    searchUserFullText,
    deactivateUser,
    addFavorite,
    removeFavorite,
}

