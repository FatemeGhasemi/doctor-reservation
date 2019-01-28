const express = require('express');
const router = express.Router();
userRepository = require('../../repositories/user');

const createNewUser = async (req, res) => {
    try {
        const user = await userRepository.createUser(req.body.phoneNumber)
        res.json({"message": "success operation", "result": user})

    } catch (e) {
        res.status(500).json({message: e.message})
    }
};

router.post('/', createNewUser);
module.exports = router;
