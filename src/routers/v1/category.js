const express = require('express');
const router = express.Router();
const categoryRepository = require('../../repositories/category');
const checkAccess = require('../../middlewares/authentication');

const createNewCategory = async (req, res) => {
    try {
        let parentName = req.body.parentName || null;
        const name = req.body.name;
        const category = await categoryRepository.crateNewCategory(parentName, name)
        res.json({message: "success operation", result: category})

    } catch (e) {
        res.status(500).json({message: e.message})
    }
};


const searchCategory = async (req, res) => {
    try {
        let categories;
        const data = req.query;
        if (data.parentName) {
            categories = await categoryRepository.findCategoryByParentName(data.parentName)
        }
        else if (data.id) {
            categories = await categoryRepository.findCategoryById(data.id)
        } else {
            categories = await categoryRepository.returnAllCategories()
        }
        res.json({message: "success operation", result: categories})

    } catch (e) {
        res.status(500).json({message: e.message})
    }
}


const updateCategoryData = async (req, res) => {
    try {
        const category = await categoryRepository.updateCategoryData(req.params.id, req.body);
        res.json({message: "success operation", result: category})
    } catch (e) {
        res.status(500).json({message: e.message})
    }
};


const changeCategoryStatus = async (req, res) => {
    try {
        const category = await categoryRepository.changeCategoryStatus(req.params.id);
        res.json({message: "success operation", result: category})
    } catch (e) {
        res.status(500).json({message: e.message})
    }
};


const changeInCategoryHandler = async (req, res) => {
    try {
        const data = req.body
        if (data.name || data.parentName) {
            await updateCategoryData(req, res)
        } else {
            await changeCategoryStatus(req, res)
        }
    } catch (e) {
        res.status(500).json({message: e.message})
    }
}


router.post('/', checkAccess.validateJwt, checkAccess.checkRolesAccess, createNewCategory);
router.put('/:id', checkAccess.validateJwt, checkAccess.checkRolesAccess, changeInCategoryHandler);
router.get('/', searchCategory)
module.exports = router;