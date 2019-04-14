const commentSchema = require('../models/comment')();
const doctorSchema = require('../models/doctor')();
const userSchema = require('../models/user')();
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
    const userId =  comment.userId
    const user = await userRepository.findUserById(userId)
    if(!user.likesCommentIdList.includes(commentId)) {
        const comment = await commentSchema.update({likesCounter: likes + 1, like: true}, {returning: true, where: {id: commentId}})
        let likesCommentIdList = user.likesCommentIdList.push(commentId)
        await userSchema.update({likesCommentIdList:likesCommentIdList},{returning:true,where:{id:userId}})
        return comment
    }
    else {
        throw new Error("user cant like a comment twice")
    }
};


const dislikeComment = async (commentId) => {
    const comment = await findCommentById(commentId)
    const dislikes = comment.dislikesCounter
    const userId =  comment.userId
    const user = await userRepository.findUserById(userId)
    if(!user.dislikesCommentIdList.includes(commentId)) {
        const comment = await commentSchema.update({dislikesCounter: dislikes + 1, like: true}, {
            returning: true,
            where: {id: commentId}
        })
        let dislikesCommentIdList = user.dislikesCommentIdList.push(commentId)
        await userSchema.update({dislikesCommentIdList:dislikesCommentIdList},{returning:true,where:{id:userId}})
        return comment
    }
    else {
        throw new Error("user cant dislike a comment twice")
    }
}


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


const findAllShownCommentOfDoctor = async (doctorId) => {
    const comments = commentSchema.findAll({where: {doctorId: doctorId}})
    const doctor = await doctorRepository.findDoctorById(doctorId)
    let res = []

    for (let i = 0; i < comments.length; i++) {
        let data = {}
        const comment = comments[i]
        const user = userRepository.findUserById(comment.userId)
        if (comment.status === "isShown") {
            data.commentText = comment.commentText
            data.commentLikes = comment.likesCounter
            data.commentDisLikes = comment.dislikesCounter
            data.userFirstName = user.firstName
            data.userLastName = user.lastName
            data.userId = user.id
            data.doctorName = doctor.name
            data.doctorType = doctor.type
            data.doctorRate = doctor.rate
            data.doctorId = doctor.id
            res.push(data)
        }
    }
    return res
}


const findAllPendingCommentOfDoctor = async (doctorId) => {
    const comments = commentSchema.findAll({where: {doctorId: doctorId}})
    const doctor = await doctorRepository.findDoctorById(doctorId)
    let res = []

    for (let i = 0; i < comments.length; i++) {
        let data = {}
        const comment = comments[i]
        const user = userRepository.findUserById(comment.userId)
        if (comment.status === "pendingToShow") {
            data.commentText = comment.commentText
            data.commentLikes = comment.likesCounter
            data.commentDisLikes = comment.dislikesCounter
            data.userFirstName = user.firstName
            data.userLastName = user.lastName
            data.userId = user.id
            data.doctorName = doctor.name
            data.doctorType = doctor.type
            data.doctorRate = doctor.rate
            data.doctorId = doctor.id
            res.push(data)
        }
    }
    return res
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
    findAllShownCommentOfDoctor,
    findCommentById,
    findAllPendingCommentOfDoctor
}
