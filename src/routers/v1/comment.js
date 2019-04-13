const express = require('express');
const doctorRepository = require("../../repositories/doctor");
const commentRepository = require("../../repositories/comment");
const userRepository = require("../../repositories/user");
const checkAccess = require('../../middlewares/authentication');
const jwtHelper = require('../../services/athorization/jwt');
const router = express.Router();


const sendComment = async (req,res)=>{
    try {
        req.body.userId = res.locals.user.id
        const doctor = await doctorRepository.findDoctorById(req.body.doctorId)
        if(doctor.accessAbility !== "deActiveComments"){
            const result = await commentRepository.createComment(req.body)
            res.json({message:"sendComment success operation", result:result})
        }
        else {
            res.json({message:"cant comment on this doctor"})
        }

    }catch (e) {
        console.log("sendComment error: ",e.message)
        res.status(500).json({"sendComment error":e.message})
    }
}


const deleteComment = async (req,res)=>{
    try {
        const comment = await commentRepository.findCommentById(req.params.commentId)
        if(res.locals.user.id === comment.userId || res.locals.user.id === comment.doctorId){
            const result = await commentRepository.deleteComment(req.params.commentId)
            res.json({message:"deleteComment success operation", result:result})
        }
        else {
            res.json({message:"user cant remove the other ones comments"})
        }
    }catch (e) {
        console.log("deleteComment error: ",e.message)
        res.status(500).json({"deleteComment error":e.message})
    }
}


const editComment = async (req,res)=>{
    try {
        const comment = await commentRepository.findCommentById(req.params.commentId)
        if(res.locals.user.id === comment.userId){
            const result = await commentRepository.editComment(req.params.commentId,req.body.commentText)
            res.json({message:"editComment success operation", result:result})
        }
        else {
            res.json({message:"user cant edit the other ones comments"})
        }
    }catch (e) {
        console.log("editComment error: ",e.message)
        res.status(500).json({"editComment error":e.message})
    }
}


const acceptCommentToShow = async (req,res)=>{
    try {
        const comment = await commentRepository.findCommentById(req.params.commentId)
        if(res.locals.user.id === comment.doctorId){
            const result = await commentRepository.allowCommentToShow(req.params.commentId)
            res.json({message:"acceptCommentToShow success operation", result:result})
        }
        else {
            res.json({message:"just doctor can accept comments"})
        }
    }catch (e) {
        console.log("acceptCommentToShow error: ",e.message)
        res.status(500).json({"acceptCommentToShow error":e.message})
    }
}


const rejectCommentToShow = async (req,res)=>{
    try {
        const comment = await commentRepository.findCommentById(req.params.commentId)
        if(res.locals.user.id === comment.doctorId){
            const result = await commentRepository.rejectCommentToShow(req.params.commentId)
            res.json({message:"rejectCommentToShow success operation", result:result})
        }
        else {
            res.json({message:"just doctor can reject comments"})
        }
    }catch (e) {
        console.log("rejectCommentToShow error: ",e.message)
        res.status(500).json({"rejectCommentToShow error":e.message})
    }
}


const deactivateCommenting = async (req,res)=>{
    try {
            const result = await commentRepository.deactivateCommenting(res.locals.user.id)
            res.json({message:"deactivateCommenting success operation", result:result})
    }catch (e) {
        console.log("deactivateCommenting error: ",e.message)
        res.status(500).json({"deactivateCommenting error":e.message})
    }
}


const makeCommentShowAfterCheck = async (req,res)=>{
    try {
        const result = await commentRepository.makeCommentShowAfterCheck(res.locals.user.id)
        res.json({message:"makeCommentShowAfterCheck success operation", result:result})
    }catch (e) {
        console.log("makeCommentShowAfterCheck error: ",e.message)
        res.status(500).json({"makeCommentShowAfterCheck error":e.message})
    }
}


const likeComment = async (req,res)=>{
    try {
        const result = await commentRepository.likeComment(req.params.commentId)
        res.json({message:"likeComment success operation", result:result})
    }catch (e) {
        console.log("likeComment error: ",e.message)
        res.status(500).json({"likeComment error":e.message})
    }
}


const dislikeComment = async (req,res)=>{
    try {
        const result = await commentRepository.dislikeComment(req.params.commentId)
        res.json({message:"dislikeComment success operation", result:result})
    }catch (e) {
        console.log("dislikeComment error: ",e.message)
        res.status(500).json({"dislikeComment error":e.message})
    }
}



router.post('/', checkAccess.validateJwt, sendComment);
router.put('/delete/:commentId', checkAccess.validateJwt, deleteComment);
router.put('/edit/:commentId', checkAccess.validateJwt, editComment);
router.put('/accept/:commentId', checkAccess.validateJwt, acceptCommentToShow);
router.put('/reject/:commentId', checkAccess.validateJwt, rejectCommentToShow);
router.put('/deactivateComment', checkAccess.validateJwt, deactivateCommenting);
router.put('/makeCommentShowAfterCheck', checkAccess.validateJwt, makeCommentShowAfterCheck);
router.put('/likeComment/:commentId', checkAccess.validateJwt, likeComment);
router.put('/dislikeComment/:commentId', checkAccess.validateJwt, dislikeComment);
module.exports = router;