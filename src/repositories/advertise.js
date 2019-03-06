let advertiseSchema = require('../models/advertise')();

const addNewAdvertise = async (data) => {
    try {
        const isDeactivate = await deactivateAllAdvertises()
        if (isDeactivate) {
            return advertiseSchema.create(data)
        } else {
            console.log("addNewAdvertise is failed")
        }
    }catch (e) {
        console.log("addNewAdvertise function failed: ",e)
    }
};

const findAdvertiseById = (id) => {
    return advertiseSchema.findOne({where: {id: id}})
}


const getAllAdvertise = () => {
    return advertiseSchema.findAll({})
};


const deactivateOneAdvertise = async (id) => {
    return advertiseSchema.update({status: "deactivate"}, {returning: true, where: {id: id}})
};

const deleteOneAdvertise = async (id) => {
    return advertiseSchema.update({status: "delete"}, {returning: true, where: {id: id}})
};


const updateAdvertise = async (data, id) => {
    let status;
    if (data.status) {
        if (data.status !== "active") {
            status = data.status
        } else {
            const advertise = await findAdvertiseById(id)
            status = advertise.status
        }
    }
    return advertiseSchema.update({url: data.url, label: data.label, status: status}, {
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
        }
        else if (allAdvertises.length === 0) {
            return true
        }
        if(res.length !==0){
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
            if (advertise.status === status) {
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
    deleteOneAdvertise
}


