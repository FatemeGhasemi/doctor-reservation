let categorySchema = require('../models/category')();
// const op = Sequelize.Op;


/**
 *
 * @param parentName
 * @returns {Promise<*>}
 */
const findCategoryByParentName = async (parentName) => {
    return categorySchema.findAll({
        where: {
            parentName:  parentName}
    })
};


/**
 *
 * @param name
 * @returns {Promise<*>}
 */
const findCategoryByName = async (name) => {
    return categorySchema.findOne({
        where: {name: name}
    })
};


/**
 *
 * @param id
 * @returns {Promise<*>}
 */
const findCategoryById = async (id) => {
    return categorySchema.findOne({where: {id: id}})
};


/**
 *
 * @param parentName
 * @param name
 * @param displayName
 * @returns {Promise<*>}
 */
const createNewCategory = async (parentName, name, displayName) => {
    return categorySchema.create({parentName,  name, displayName})
};


/**
 *
 * @param id
 * @param data
 * @returns {Promise<*>}
 */
const updateCategoryData = async (id, data) => {
    const options = {name: data.name, parentName: data.parentName}
    if (!data.name)delete options['name']
    if (!data.parentName && data.parentName !==null)delete options['parentName']
    return categorySchema.update(options,
        {returning: true, where: {id: id}}
    )
};


/**
 *
 * @param id
 * @returns {Promise<*>}
 */
const changeCategoryStatus = async (id) => {
    const category = await findCategoryById(id);
    if (category.isAvailable) {
        return categorySchema.update({isAvailable: false}, {returning: true, where: {id: id}})
    } else {
        return categorySchema.update({isAvailable: true}, {returning: true, where: {id: id}})
    }
};


/**
 *
 * @param offset
 * @param limit
 * @returns {Promise<*>}
 */
const returnAllCategories = async (offset = 0, limit = 10) => {
    return categorySchema.findAll(
        {offset: offset, limit: limit},
    )
};


module.exports = {
    findCategoryByParentName,
    findCategoryByName,
    crateNewCategory: createNewCategory,
    updateCategoryData,
    changeCategoryStatus,
    findCategoryById,
    returnAllCategories
};
