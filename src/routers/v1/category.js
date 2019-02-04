const express = require('express');
const router = express.Router();
const categoryRepository = require('../../repositories/category');
const checkAccess = require('../../middlewares/authentication');

const createNewCategory = async (req, res) => {
    try {
        let parentName = req.body.parentName;
        const name = req.body.name;
        if (parentName === "") {
            parentName = name;
        }
        const category = await categoryRepository.crateNewCategory(parentName, name)
        res.json({message: "success operation", result: category})

    } catch (e) {
        res.status(500).json({message: e.message})
    }
};

const updateCategoryData = async (req, res) => {
    try {

        const category = await categoryRepository.updateCategoryData(req.params.id, req.body);
        res.json({message: "success operation", result: category})
    } catch (e) {
        res.status(500).json({message: e.message})
    }
};


router.post('/', checkAccess.validateJwt, checkAccess.checkRolesAccess, createNewCategory);
router.put('/:id', checkAccess.validateJwt, checkAccess.checkRolesAccess, updateCategoryData);
module.exports = router;