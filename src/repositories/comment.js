const commentSchema = require('../models/comment')();
const doctorSchema = require('../models/doctor')();
const userSchema = require('../models/user')();
const userRepository = require('../repositories/user');
const doctorRepository = require('../repositories/doctor');
const officeRepository = require('../repositories/office')
const utils = require('../utils/utils')


const createComment = (data) => {
    return commentSchema.create({
        commentText: data.commentText,
        doctorId: data.doctorId,
        userId: data.userId,
        status: data.status
    })
};


const findCommentById = (commentId) => {
    return commentSchema.findOne({where: {id: commentId}})
};


const likeComment = async (commentId, userId) => {
    const comment = await findCommentById(commentId)
    const likes = comment.likesCounter
    const user = await userRepository.findUserById(userId)
    let likesCommentIdList = user.likesCommentIdList
    if (!user.likesCommentIdList.includes(comment.id) && !user.dislikesCommentIdList.includes(comment.id)) {
        const c = await commentSchema.update({likesCounter: likes + 1, like: true}, {
            returning: true,
            where: {id: comment.id}
        })
        likesCommentIdList.push(comment.id)
        const u = await userSchema.update({likesCommentIdList: likesCommentIdList}, {
            returning: true,
            where: {id: userId}
        })
        return c[1]
    } else {
        throw new Error("user cant like a comment twice")
    }
};


const dislikeComment = async (commentId, userId) => {
    const comment = await findCommentById(commentId)
    const dislikes = comment.dislikesCounter
    const user = await userRepository.findUserById(userId)
    let dislikesCommentIdList = user.dislikesCommentIdList
    if (!dislikesCommentIdList.includes(comment.id) && !user.likesCommentIdList.includes(comment.id)) {
        const c = await commentSchema.update({dislikesCounter: dislikes + 1, like: true}, {
            returning: true,
            where: {id: comment.id}
        })
        dislikesCommentIdList.push(comment.id)
        const u = await userSchema.update({dislikesCommentIdList: dislikesCommentIdList}, {
            returning: true,
            where: {id: userId}
        })
        return c[1]
    } else {
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
        await doctorSchema.update({accessAbility: "showAfterCheck",status: "showAfterCheck"},{returning:true,where:{id:doctorId}})
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


const findCommentListByDoctorId = (doctorId)=>{
    return commentSchema.findAll({where: {doctorId: doctorId}})
}


const findAllShownCommentOfDoctor = async (doctorId) => {
    const comments = await findCommentListByDoctorId(doctorId)
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


const showUserLikeList = async (userId) => {
    let res = []
    const user = await userRepository.findUserById(userId)
    const userLikeList = user.likesCommentIdList
    for (let i = 0; i < userLikeList.length; i++) {
        let data = {}
        const commentId = userLikeList[i]
        const comment = await findCommentById(commentId)
        const doctor = await doctorRepository.findDoctorById(comment.doctorId)
        data.commentText = comment.commentText
        data.commentId = comment.id
        data.userFirstName = user.firstName
        data.userLastName = user.lastName
        data.userId = user.id
        data.doctorId = doctor.id
        data.doctorName = doctor.name
        data.doctorType = doctor.type
        data.doctorRate = doctor.rate
        data.doctorCode = doctor.doctorCode
        data.doctorPhoto = doctor.avatarUrl
        if (doctor.doctorProprietaryAppCode) {
            data.doctorProprietaryAppCode = doctor.doctorProprietaryAppCode
        }
        data.doctorMedicalSystemNumber = doctor.medicalSystemNumber
        res.push(data)
    }
    return res
}

const showUserDisLikeList = async (userId) => {
    let res = []
    const user = await userRepository.findUserById(userId)
    const userDisLikeList = user.dislikesCommentIdList
    for (let i = 0; i < userDisLikeList.length; i++) {
        let data = {}
        const commentId = userDisLikeList[i]
        const comment = await findCommentById(commentId)
        const doctor = await doctorRepository.findDoctorById(comment.doctorId)
        data.commentText = comment.commentText
        data.commentId = comment.id
        data.userFirstName = user.firstName
        data.userLastName = user.lastName
        data.userId = user.id
        data.doctorId = doctor.id
        data.doctorName = doctor.name
        data.doctorType = doctor.type
        data.doctorRate = doctor.rate
        data.doctorCode = doctor.doctorCode
        data.doctorPhoto = doctor.avatarUrl
        if (doctor.doctorProprietaryAppCode) {
            data.doctorProprietaryAppCode = doctor.doctorProprietaryAppCode
        }
        data.doctorMedicalSystemNumber = doctor.medicalSystemNumber
        res.push(data)
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
    findAllPendingCommentOfDoctor,
    showUserDisLikeList,
    showUserLikeList
}
