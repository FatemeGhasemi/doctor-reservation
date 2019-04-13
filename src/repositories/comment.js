const commentSchema = require('../models/comment')();
const userRepository = require('../repositories/user');
const doctorRepository = require('../repositories/doctor');
const officeRepository = require('../repositories/office')
const utils = require('../utils/utils')


const createComment = (data)=>{
    return commentSchema.create({commentText:data.commentText,doctorId:data.doctorId})
};


const findCommentById = (commentId)=>{
    return commentSchema.findOne({where:{id:commentId}})
};


const likeComment = async  (commentId)=>{
    const comment = await findCommentById(commentId)
    const likes = comment.likes
    return commentSchema.update({likes:likes+1},{returning:true,where:{id:commentId}})
};


const dislikeComment = async  (commentId)=>{
    const comment = await findCommentById(commentId)
    const dislikes = comment.dislikes
    return commentSchema.update({dislikes:dislikes+1},{returning:true,where:{id:commentId}})
};


const editComment = (commentId, newCommentText)=>{
    return commentSchema.update({commentText: newCommentText},{returning:true,where:{id:commentId}})
};


const deleteComment = (commentId)=>{
    return commentSchema.update({status: "deleted"},{returning:true,where:{id:commentId}})
};






module.exports = {
    createComment,
    likeComment,
    dislikeComment,
    editComment,
    deleteComment
}
