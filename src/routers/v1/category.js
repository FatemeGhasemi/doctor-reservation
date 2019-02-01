const express = require('express');
const router = express.Router();
const categoryRepository = require('../../repositories/category');
const checkAccess = require('../../middlewares/authentication');

const createNewCategory = async (req, res) => {
    try {
        const category = await categoryRepository.crateNewCategory(req.body.parentId)
        res.json({message: "success operation", result: category})

    } catch (e) {
        res.status(500).json({message: e.message})
    }
};


router.post('/', checkAccess.checkRolesAccess,createNewCategory());
router.put('/:name',checkAccess.checkRolesAccess(), updateUserData);
module.exports = router;