const statusSchema = require('../models/billing')();


/**
 *
 * @param id
 * @returns {Promise<*>}
 */
const findStatusById = async (id) => {
    return statusSchema.findOne({where: {id: id}})
};


/**
 *
 * @param name
 * @returns {Promise<*>}
 */
const findStatusByName = async (name) => {
    return statusSchema.findOne({where: {name: name}})
};


/**
 *
 * @param name
 * @returns {Promise<*>}
 */
const createStatus = async (name) => {
    return statusSchema.create({name: name})
}
module.exports = {findStatusById, findStatusByName, createStatus}