const commentSchema = require('../models/comment')();
const doctorSchema = require('../models/doctor')();
const userRepository = require('../repositories/user');
const doctorRepository = require('../repositories/doctor');
const officeRepository = require('../repositories/office')
const utils = require('../utils/utils')


const createComment = (data) => {
    return commentSchema.create({commentText: data.commentText, doctorId: data.doctorId, userId: data.userId})
};


const findCommentById = (commentId) => {
    return commentSchema.findOne({where: {id: commentId}})
};


const likeComment = async (commentId) => {
    const comment = await findCommentById(commentId)
    const likes = comment.likesCounter
    if(!comment.like) {
        return commentSchema.update({likesCounter: likes + 1, like: true}, {returning: true, where: {id: commentId}})
    }
    else {
        throw new Error("user cant give vote to a comment twice")
    }
};


const dislikeComment = async (commentId) => {
    const comment = await findCommentById(commentId)
    const dislikes = comment.dislikesCounter
    if(!comment.like) {
        return  commentSchema.update({dislikesCounter: dislikes + 1, like: true}, {
            returning: true,
            where: {id: commentId}
        })
    }
    else {
        throw new Error("user cant give vote to a comment twice")
    }
};


const editComment = (commentId, newCommentText) => {
    return commentSchema.update({commentText: newCommentText}, {returning: true, where: {id: commentId}})
};


const deleteComment = (commentId) => {
    return commentSchema.update({status: "deleted"}, {returning: true, where: {id: commentId}})
};


const findCommentsByDoctorId = (doctorId) => {
    return commentSchema.findAll({where: {doctorId: doctorId}})
}


const makeCommentShowAfterCheck = async (doctorId) => {
    let res = []
    const comments = await findCommentsByDoctorId(doctorId)
    await doctorSchema.update({accessAbility: "showAfterCheck"}, {
        returning: true,
        where: {id: doctorId}
    })

    for (let i = 0; i < comments.length; i++) {
        const commentId = comments[i].id
        const data = commentSchema.update({status: "pendingToShow"},
            {returning: true, where: {id: commentId}})
        res.push(data)
    }
    return res
}


const deactivateCommenting = async (doctorId) => {
    let res = []
    const comments = await findCommentsByDoctorId(doctorId)
    await doctorSchema.update({accessAbility: "deActiveComments"}, {
        returning: true,
        where: {id: doctorId}
    })
    for (let i = 0; i < comments.length; i++) {
        const commentId = comments[i].id
        const data = commentSchema.update({status: "hideComments"},
            {returning: true, where: {id: commentId}})
        res.push(data)
    }
    return res
}


const allowCommentToShow = (commentId) => {
    return commentSchema.update({status: "isShown"}, {returning: true, where: {id: commentId}})
}


const rejectCommentToShow = (commentId) => {
    return commentSchema.update({status: "rejectedToShow"}, {returning: true, where: {id: commentId}})
}


const findAllShownComment = () => {
    return commentSchema.findAll({where: {status: "isShown"}})
}


module.exports = {
    createComment,
    likeComment,
    dislikeComment,
    editComment,
    deleteComment,
    makeCommentShowAfterCheck,
    allowCommentToShow,
    rejectCommentToShow,
    deactivateCommenting,
    findAllShownComment,
    findCommentById
}
