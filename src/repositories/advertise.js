let advertiseSchema = require('../models/advertise')();

const addNewAdvertise = async (data) => {
    const isDeactivate = await deactivateAllAdvertises()
    if (isDeactivate) {
        return advertiseSchema.create(data)
    } else {
        console.log("addNewAdvertise is failed")
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
        const allAdvertises = await getAllAdvertize()
        if (allAdvertises.length !== 0) {
            for (let i = 0; i < allAdvertises.length; i++) {
                const advertise = allAdvertises[i]
                const advertiseId = advertise.id
                await deactivateOneAdvertise(advertiseId)
            }
        }
        return true
    } catch (e) {
        console.log(" fail deactivateAllAdvertises: ", e.message)
    }
};


module.exports = {addNewAdvertise, getAllAdvertise, updateAdvertise}


