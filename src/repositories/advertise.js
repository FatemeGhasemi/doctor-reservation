let advertiseSchema = require('../models/advertise')();
const utils = require('../utils/utils')

const addNewAdvertise = async (data) => {
    return advertiseSchema.create(data)

};


const showActiveAdvertises = async () => {
    let valid = []
    const activeAdvertises = await advertiseSchema.findAll({where: {status: "active"}})
    for (let i = 0; i < activeAdvertises.length; i++) {
        const activeAdvertise = activeAdvertises[i]
        if (utils.ifTodayIsAtLeastOneDayBefore(activeAdvertise.expireDate)) {
            valid.push(activeAdvertise.url)
        }
    }
    return valid
}


const findAdvertiseById = (id) => {
    return advertiseSchema.findOne({where: {id: id}})
}


const getAllAdvertise = () => {
    return advertiseSchema.findAll({})
};


const deactivateOneAdvertise = async (id) => {
    return advertiseSchema.update({status: "deactivate"}, {returning: true, where: {id: id}})
};

const activateOneAdvertise = async (id) => {
    return advertiseSchema.update({status: "active"}, {returning: true, where: {id: id}})
};

const deleteOneAdvertise = async (id) => {
    return advertiseSchema.update({status: "delete"}, {returning: true, where: {id: id}})
};


const updateAdvertise = async (data, id) => {
    return advertiseSchema.update({url: data.url, label: data.label}, {
        returning: true,
        where: {id: id}
    })

}


const deactivateAllAdvertises = async () => {
    try {
        let res = []
        const allAdvertises = await getAllAdvertise()
        if (allAdvertises.length !== 0) {
            for (let i = 0; i < allAdvertises.length; i++) {
                const advertise = allAdvertises[i]
                const advertiseId = advertise.id
                const result = await deactivateOneAdvertise(advertiseId)
                res.push(result)
            }
        } else if (allAdvertises.length === 0) {
            return true
        }
        if (res.length !== 0) {
            return true
        }
    } catch (e) {
        console.log(" fail deactivateAllAdvertises: ", e.message)
    }
};

const findAdvertiseByStatus = async (status) => {
    let res = []
    const allAdvertise = await getAllAdvertise()
    if (allAdvertise.length !== 0) {
        for (let i = 0; i < allAdvertise.length; i++) {
            const advertise = allAdvertise[i]
            if (!utils.ifTodayIsAtLeastOneDayBefore(advertise.expireDate)) {
                await deactivateOneAdvertise(advertise.id)
                if(status === "deactivate"){
                    res.push(advertise)
                }
            }
            else if (advertise.status === status) {
                res.push(advertise)
            }
        }
    }
    return res

}


module.exports = {
    addNewAdvertise,
    getAllAdvertise,
    updateAdvertise,
    findAdvertiseById,
    findAdvertiseByStatus,
    deactivateOneAdvertise,
    deleteOneAdvertise,
    showActiveAdvertises,
    activateOneAdvertise
}


