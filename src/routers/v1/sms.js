const express = require('express');
const router = express.Router();
const userRepository = require('../../repositories/user');
const checkAccess = require('../../middlewares/authentication')
const sms = require('../../services/sms')


const sendSmsToUser = async (req, res) => {
    try {
        let users;
        let phones = []
        if (req.query.city) {
            users = await userRepository.getUsersInCity(req.query.city)
            for (let i = 0; i < users.length; i++) {
                let user = users[i]
                await sms.send(user.phoneNumber, req.body.message)
            }
        } else {
            users = await userRepository.getAllUsers()
            for (let i = 0; i < users.length; i++) {
                let user = users[i]
                phones.push(user.phoneNumber)

                await sms.send(user.phoneNumber, req.body.message)
            }
        }

        res.json({message: "success operation", result: {usersPhoneNumbers:phones,message:req.body.message}})

    } catch (e) {
        res.status(500).json({message: e.message})

    }


}


router.post('/', checkAccess.validateJwt,checkAccess.checkRolesAccess, sendSmsToUser);
module.exports = router;