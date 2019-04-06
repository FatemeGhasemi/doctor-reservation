let categorySchema = require('../models/category')();
// const op = Sequelize.Op;


/**
 * find a category by its parent
 * @param parentName
 * @returns {Promise<*>}
 */
const findCategoryByParentName = async (parentName) => {
    return categorySchema.findAll({
        where: {
            parentName: parentName
        }
    })
};


/**
 * find category by its name
 * @param name
 * @returns {Promise<*>}
 */
const findCategoryByName = async (name) => {
    return categorySchema.findAll({
        where: {name: name}
    })
};


/**
 * find a category by its id
 * @param id
 * @returns {Promise<*>}
 */
const findCategoryById = async (id) => {
    return categorySchema.findOne({where: {id: id}})
};


/**
 * create a new category by admin
 * @param parentName
 * @param name
 * @param displayName
 * @returns {Promise<*>}
 */
const createNewCategory = async (parentName, name, displayName,photoUrl) => {
    return categorySchema.create({parentName, name, displayName,photoUrl})
};


/**
 * update category data by admin
 * @param id
 * @param data
 * @returns {Promise<*>}
 */
const updateCategoryData = async (id, data) => {
    const options = {name: data.name, parentName: data.parentName}
    if (!data.name) delete options['name']
    if (!data.parentName && data.parentName !== null) delete options['parentName']
    return categorySchema.update(options,
        {returning: true, where: {id: id}}
    )
};


/**
 * change category status
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
 * return all categories
 * @param offset
 * @param limit
 * @returns {Promise<*>}
 */
const returnAllCategories = async (offset = 0, limit = 10) => {
    return categorySchema.findAll(
        {offset: offset, limit: limit},
    )
};


const returnAllCategoryThatTheirParentsNull = async () => {
    let res = []
    const allCategories = await categorySchema.findAll({where: {parentName: null}})

    for (let i = 0; i < allCategories.length; i++) {
        let data = {}
        const category = allCategories[i]
        data.categoryName = category.name
        data.categoryDisplayName = category.displayName
        res.push(data)
    }

    return res
}


const findCategoryIdByAnArrayOfCategories = async (arrayOfCategories) => {
    try {
        let i = 1;
        let tempCategory = await findCategoryByName(arrayOfCategories[arrayOfCategories.length - i])
        while (tempCategory.length > 1) {
            i++
            tempCategory = findChildesOfCategory(tempCategory, arrayOfCategories[arrayOfCategories.length - i])
        }
        return tempCategory[0].id
    } catch (e) {
        throw new Error('Category not found')
    }
}

//TODO this name is temporary , and doesn't represent function correctly
const findChildesOfCategory = (categories, parent) => {
    const returnCategories = []
    for (let j = 0; j < categories.length; j++) {
        const category = categories[j]
        if (category.parentName === parent) {
            returnCategories.push(category)
        }
    }
    return returnCategories

}


module.exports = {
    findCategoryByParentName,
    crateNewCategory: createNewCategory,
    updateCategoryData,
    changeCategoryStatus,
    findCategoryById,
    returnAllCategories,
    returnAllCategoryThatTheirParentsNull,
    findCategoryIdByAnArrayOfCategories
};
