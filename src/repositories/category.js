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
const createNewCategory = async (parentName, name, displayName) => {
    return categorySchema.create({parentName, name, displayName})
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
    const allCategories = await categorySchema.finAll({where: {parentName: null}})

    for (let i = 0; i < allCategories.length; i++) {
        const category = allCategories[i]
        res.push(category.displayName)
    }

    return res
}


const findCategoryIdByAnArrayOfCategories = async (arrayOfCategories) => {
    let categoriesLevel2 = []
    let categoriesLevel3 = []
    let categoriesLevel4 = []
    let categoriesLevel5 = []
    const categoriesLevel1 = await findCategoryByName(arrayOfCategories[arrayOfCategories.length - 1])
    for (let j = 0; j < categoriesLevel1.length; j++) {
        const categoriesA = categoriesLevel1[j]
        if (categoriesA.parentName === (arrayOfCategories[arrayOfCategories.length - 2])) {
            categoriesLevel2.push(categoriesA)
        }
    }
    if (categoriesLevel2.length > 1) {
        for (let i = 0; i < categoriesLevel2.length; i++) {
            const categoriesB = categoriesLevel2[i]
            if (categoriesB.parentName === (arrayOfCategories[arrayOfCategories.length - 3])) {
                categoriesLevel3.push(categoriesB)
            }
        }
        if (categoriesLevel3.length > 1) {
            for (let k = 0; k < categoriesLevel3.length; k++) {
                const categoriesC = categoriesLevel3[k]
                if (categoriesC.parentName === (arrayOfCategories[arrayOfCategories.length - 4])) {
                    categoriesLevel4.push(categoriesC)
                }
            }
            if (categoriesLevel4.length > 1) {
                for (let m = 0; m < categoriesLevel4.length; m++) {
                    const categoriesD = categoriesLevel4[m]
                    if (categoriesD.parentName === (arrayOfCategories[arrayOfCategories.length - 5])) {
                        categoriesLevel5.push(categoriesD)
                    }
                }
            } else {
                return categoriesLevel4[0].id
            }
        } else {
            return categoriesLevel3[0].id
        }


    } else {
        return categoriesLevel2[0].id
    }

    if (categoriesLevel5.length === 1) {
        return categoriesLevel5[0].id
    }
}


//TODO this name is temporary , and doesn't represent function correctly
const findChildsOfCategory =(categories, parent)=>{
    const returnCategories =[]
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
