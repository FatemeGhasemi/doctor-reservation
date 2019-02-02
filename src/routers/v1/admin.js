const express = require('express');
const router = express.Router();
const userRepository = require('../../repositories/user');
const checkAccess = require('../../middlewares/authentication');


const updateUserData = async (req, res) => {
    try {
        const user = await userRepository.updateUserByAdmin(req.body.phoneNumber,req.body)
        res.json({message: "success operation", result: user})

    }catch (e) {
        res.status(500).json({message: e.message})
    }
};


router.put('/',checkAccess.checkAccess, updateUserData);
module.exports = router;