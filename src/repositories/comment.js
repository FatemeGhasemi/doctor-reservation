const commentSchema = require('../models/comment')();
const doctorSchema = require('../models/doctor')();
const officeSchema = require('../models/office')();
const userSchema = require('../models/user')();
const userRepository = require('../repositories/user');
const doctorRepository = require('../repositories/doctor');
const officeRepository = require('../repositories/office')
const utils = require('../utils/utils')


const createComment = (data) => {
    return commentSchema.create({
        commentText: data.commentText,
        officeId: data.officeId,
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
    }
    if (user.likesCommentIdList.includes(comment.id)) {
        const c = await commentSchema.update({likesCounter: likes - 1, like: true}, {
            returning: true,
            where: {id: comment.id}
        })
        likesCommentIdList.push(comment.id)
        const u = await userSchema.update({likesCommentIdList: likesCommentIdList}, {
            returning: true,
            where: {id: userId}
        })
        return c[1]
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
    }
    if (dislikesCommentIdList.includes(comment.id)) {
        const c = await commentSchema.update({dislikesCounter: dislikes - 1, like: true}, {
            returning: true,
            where: {id: comment.id}
        })
        dislikesCommentIdList.push(comment.id)
        const u = await userSchema.update({dislikesCommentIdList: dislikesCommentIdList}, {
            returning: true,
            where: {id: userId}
        })
        return c[1]
    }
}


const editComment = (commentId, newCommentText) => {
    return commentSchema.update({commentText: newCommentText}, {returning: true, where: {id: commentId}})
};


const deleteComment = (commentId) => {
    return commentSchema.update({status: "deleted"}, {returning: true, where: {id: commentId}})
};


const findCommentsByOfficeId = (officeId) => {
    return commentSchema.findAll({where: {officeId: officeId}})
}


const makeCommentShowAfterCheck = async (officeId) => {
    // let res = []
    const comments = await findCommentsByOfficeId(officeId)
    return await officeSchema.update({commentAccessAbility: "showAfterCheck"}, {
        returning: true,
        where: {id: officeId}
    })

    // for (let i = 0; i < comments.length; i++) {
    //     const commentId = comments[i].id
    //     const data = commentSchema.update({status: "pendingToShow"},
    //         {returning: true, where: {id: commentId}})
    //     res.push(data)
    // }
    // return res
}


const deactivateCommenting = async (officeId) => {
    let res = []
    const comments = await findCommentsByOfficeId(officeId)
    return await officeSchema.update({commentAccessAbility: "deActiveComments"}, {
        returning: true,
        where: {id: officeId}
    })
    // for (let i = 0; i < comments.length; i++) {
    //     const commentId = comments[i].id
    //     const data = commentSchema.update({status: "hideComments"},
    //         {returning: true, where: {id: commentId}})
    //     res.push(data)
    // }
    // return res
}


const allowCommentToShow = (commentId) => {
    return commentSchema.update({status: "isShown"}, {returning: true, where: {id: commentId}})
}


const rejectCommentToShow = (commentId) => {
    return commentSchema.update({status: "rejectedToShow"}, {returning: true, where: {id: commentId}})
}


const findCommentListByOfficeId = (officeId) => {
    return commentSchema.findAll({where: {officeId: officeId}})
}


const findAllShownCommentOfDoctor = async (officeId) => {
    const comments = await findCommentListByOfficeId(officeId)
    const office = await officeRepository.findOfficeById(officeId)
    const doctor = doctorRepository.findDoctorByOfficeId(officeId)
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
            data.officeId = officeId
            data.officeAddress = office.address
            data.officeLat = office.lat
            data.officeLong = office.long
            res.push(data)
        }
    }
    return res
}


const findAllPendingCommentOfDoctor = async (officeId) => {
    const comments = commentSchema.findAll({where: {officeId: officeId}})
    const doctor = await doctorRepository.findDoctorByOfficeId(officeId)
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


const showUserLikeList = async (userId, officeId) => {
    let res = []
    const user = await userRepository.findUserById(userId)
    const userLikeList = user.likesCommentIdList
    for (let i = 0; i < userLikeList.length; i++) {
        const commentId = userLikeList[i]
        const comment = await findCommentById(commentId)
        // const office = await officeRepository.findOfficeById(comment.officeId)
        // data.commentText = comment.commentText
        if (comment.officeId == officeId) {
            let data = {}
            data.commentId = comment.id
            res.push(data)
        }
        // data.userFirstName = user.firstName
        // data.userLastName = user.lastName
        // data.userId = user.id
        // data.doctorId = doctor.id
        // data.doctorName = doctor.name
        // data.doctorType = doctor.type
        // data.doctorRate = doctor.rate
        // data.doctorCode = doctor.doctorCode
        // data.doctorPhoto = doctor.avatarUrl
        // if (doctor.doctorProprietaryAppCode) {
        //     data.doctorProprietaryAppCode = doctor.doctorProprietaryAppCode
        // }
        // data.doctorMedicalSystemNumber = doctor.medicalSystemNumber
    }
    return res
}


const showUserDisLikeList = async (userId, officeId) => {
    let res = []
    const user = await userRepository.findUserById(userId)
    const userDisLikeList = user.dislikesCommentIdList
    for (let i = 0; i < userDisLikeList.length; i++) {
        const commentId = userDisLikeList[i]
        const comment = await findCommentById(commentId)
        // const office = await officeRepository.findOfficeById(comment.officeId)
        // data.commentText = comment.commentText
        if (comment.officeId == officeId) {
            let data = {}
            data.commentId = comment.id
            res.push(data)
        }
        // data.userFirstName = user.firstName
        // data.userLastName = user.lastName
        // data.userId = user.id
        // data.doctorId = doctor.id
        // data.doctorName = doctor.name
        // data.doctorType = doctor.type
        // data.doctorRate = doctor.rate
        // data.doctorCode = doctor.doctorCode
        // data.doctorPhoto = doctor.avatarUrl
        // if (doctor.doctorProprietaryAppCode) {
        //     data.doctorProprietaryAppCode = doctor.doctorProprietaryAppCode
        // }
        // data.doctorMedicalSystemNumber = doctor.medicalSystemNumber
    }
    return res
}


const showCommentsInPage = async (userId, officeId) => {
    const allOfficeComment = await findAllShownCommentOfDoctor(officeId)
    const listOfLike = await showUserLikeList(userId, officeId)
    const listOfDisLike = await showUserDisLikeList(userId, officeId)
    return {"listOfLike": listOfLike, "listOfDisLike": listOfDisLike, "allOfOfficeCommentsData": allOfficeComment}
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
    showUserLikeList,
    showCommentsInPage
}
