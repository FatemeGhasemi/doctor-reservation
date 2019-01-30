const findCategoryByParentId = async (parentId) => {
    const categorySchema = await getUserSchema();
    return userSchema.findOne({where: {phoneNumber: phoneNumber}})
};

const findCategoryByName = async ()=>{
//    TODO return category data
};

module.exports = {
    findCategoryByParents, findCategoryByName
}
