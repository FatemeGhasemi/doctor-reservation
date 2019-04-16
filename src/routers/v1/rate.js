const express = require('express');
const doctorRepository = require("../../repositories/doctor");
const commentRepository = require("../../repositories/comment");
const userRepository = require("../../repositories/user");
const checkAccess = require('../../middlewares/authentication');
const jwtHelper = require('../../services/athorization/jwt');
const router = express.Router();


const showUsersListOfCommentsThatLike = async (req,res)=>{
    try {
        const result =  await commentRepository.showUserLikeList(res.locals.user.id)
        res.json({message: "showUsersListOfCommentsThatLike success operation", result: result})

    }catch (e) {
        console.log("showUsersListOfCommentsThatLike error: ", e.message)
        res.status(500).json({"showUsersListOfCommentsThatLike error": e.message})
    }
}




router.post('/', checkAccess.validateJwt, sendComment);
module.exports = router;
