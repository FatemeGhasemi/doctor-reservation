const express = require('express');
const router = express.Router();
userRepository = require('../../repositories/user');

const createNewUser = async (req, res) => {
    try {
        const user = await userRepository.createUser(req.body.phoneNumber)
        res.json({message: "success operation", result: user})

    } catch (e) {
        res.status(500).json({message: e.message})
    }
};

const updateUserData = async (req, res) => {
    try {
        const user = await userRepository.updateUser(req.body.phoneNumber,req.body)
        res.json({message: "success operation", result: user})

    }catch (e) {
        res.status(500).json({message: e.message})
    }
}


router.post('/', createNewUser);
router.put('/',updateUserData);
module.exports = router;
