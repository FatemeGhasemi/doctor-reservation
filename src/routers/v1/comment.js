const express = require('express');
const doctorRepository = require("../../repositories/doctor");
const commentRepository = require("../../repositories/comment");
const userRepository = require("../../repositories/user");
const checkAccess = require('../../middlewares/authentication');
const jwtHelper = require('../../services/athorization/jwt');
const router = express.Router();


const sendComment = async (req,res)=>{
    try {
        await commentRepository.createComment(req.body)


    }catch (e) {
        console.log("sendComment error: ",e.message)
        res.status(500).json({"sendComment error":e.message})
    }
}









router.put('', checkAccess.validateJwt, );


module.exports = router;