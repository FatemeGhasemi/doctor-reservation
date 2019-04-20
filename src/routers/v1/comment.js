const express = require('express');
const doctorRepository = require("../../repositories/doctor");
const commentRepository = require("../../repositories/comment");
const userRepository = require("../../repositories/user");
const officeRepository = require("../../repositories/office");
const secretaryRepository = require("../../repositories/secretary");
const checkAccess = require('../../middlewares/authentication');
const jwtHelper = require('../../services/athorization/jwt');
const router = express.Router();


const sendComment = async (req, res) => {
    try {
        req.body.userId = res.locals.user.id
        const doctor = await doctorRepository.findDoctorByOfficeId(req.body.officeId)
        if (doctor.accessAbility === "showAfterCheck") {
            req.body.status = "pendingToShow"
            const result = await commentRepository.createComment(req.body)
            res.json({message: "sendComment success operation", result: result})
        } else if (doctor.accessAbility === "isShown") {
            req.body.status = "isShown"
            const result = await commentRepository.createComment(req.body)
            res.json({message: "sendComment success operation", result: result})
        } else if (doctor.accessAbility === "deActiveComments") {
            res.json({message: "cant comment on this doctor"})
        }

    } catch (e) {
        console.log("sendComment error: ", e.message)
        res.status(500).json({"sendComment error": e.message})
    }
}


const deleteComment = async (req, res) => {
    try {
        let result
        const comment = await commentRepository.findCommentById(req.params.commentId)
        const user = await userRepository.findUserById(res.locals.user.id)
        const office = await officeRepository.findOfficeById(comment.officeId)
        if (user.role === "secretary") {
            const secretary = secretaryRepository.findSecretaryByUserId(res.locals.user.id)
            if (office.secretaryId === secretary.id) {
                result = await commentRepository.deleteComment(req.params.commentId)
            }
        }
        if (user.role === "doctor") {
            const doctor = await doctorRepository.findDoctorByUserId(res.locals.user.id)
            if (doctor.id === office.doctorId) {
                result = await commentRepository.deleteComment(req.params.commentId)
            }
        if(user.role === "user"){
            if(res.locals.user.id === comment.userId){
                result = await commentRepository.deleteComment(req.params.commentId)
            }
        }
        } else {
            res.json({message: "user cant remove the other ones comments"})
        }

        res.json({message: "deleteComment success operation", result: result})

    } catch (e) {
        console.log("deleteComment error: ", e.message)
        res.status(500).json({"deleteComment error": e.message})
    }
}


const acceptCommentToShow = async (req, res) => {
    try {
        let result
        const comment = await commentRepository.findCommentById(req.params.commentId)
        const user = await userRepository.findUserById(res.locals.user.id)
        const office = await officeRepository.findOfficeById(comment.officeId)
        if (user.role === "secretary") {
            const secretary = secretaryRepository.findSecretaryByUserId(res.locals.user.id)
            if (office.secretaryId === secretary.id&& doctor.accessAbility === "showAfterCheck"
                && comment.status === "pendingToShow") {
                 result = await commentRepository.allowCommentToShow(req.params.commentId)
            }
        }
        if (user.role === "doctor") {
            const doctor = await doctorRepository.findDoctorByUserId(res.locals.user.id)
            if (doctor.id === office.doctorId && doctor.accessAbility === "showAfterCheck"
                && comment.status === "pendingToShow") {
                result = await commentRepository.allowCommentToShow(req.params.commentId)
            }
        }
        else {
            res.json({message: "just doctor or his/her secretary can accept comments"})
        }
        res.json({message: "acceptCommentToShow success operation", result: result})

    } catch (e) {
        console.log("acceptCommentToShow error: ", e.message)
        res.status(500).json({"acceptCommentToShow error": e.message})
    }
}


const rejectCommentToShow = async (req, res) => {
    try {
        let result
        const comment = await commentRepository.findCommentById(req.params.commentId)
        const user = await userRepository.findUserById(res.locals.user.id)
        const office = await officeRepository.findOfficeById(comment.officeId)
        if (user.role === "secretary") {
            const secretary = secretaryRepository.findSecretaryByUserId(res.locals.user.id)
            if (office.secretaryId === secretary.id&& doctor.accessAbility === "showAfterCheck"
                && comment.status === "pendingToShow") {
                result = await commentRepository.rejectCommentToShow(req.params.commentId)
            }
        }
        if (user.role === "doctor") {
            const doctor = await doctorRepository.findDoctorByUserId(res.locals.user.id)
            if (doctor.id === office.doctorId && doctor.accessAbility === "showAfterCheck"
                && comment.status === "pendingToShow") {
                result = await commentRepository.rejectCommentToShow(req.params.commentId)
            }
        }
        else {
            res.json({message: "just doctor can reject comments"})
        }
        res.json({message: "rejectCommentToShow success operation", result: result})
    } catch (e) {
        console.log("rejectCommentToShow error: ", e.message)
        res.status(500).json({"rejectCommentToShow error": e.message})
    }
}




const editComment = async (req, res) => {
    try {
        const comment = await commentRepository.findCommentById(req.params.commentId)
        if (res.locals.user.id === comment.userId) {
            const result = await commentRepository.editComment(req.params.commentId, req.body.commentText)
            res.json({message: "editComment success operation", result: result})
        } else {
            res.json({message: "user cant edit the other ones comments"})
        }
    } catch (e) {
        console.log("editComment error: ", e.message)
        res.status(500).json({"editComment error": e.message})
    }
}







const deactivateCommenting = async (req, res) => {
    try {
        let data = {}
        const doctor = await doctorRepository.findDoctorByUserId(res.locals.user.id)
        await commentRepository.deactivateCommenting(doctor.id)
        data.doctorName = doctor.name
        data.doctorType = doctor.type
        data.doctorId = doctor.id
        res.json({message: "deactivateCommenting success operation", result: data})
    } catch (e) {
        console.log("deactivateCommenting error: ", e.message)
        res.status(500).json({"deactivateCommenting error": e.message})
    }
}


const makeCommentShowAfterCheck = async (req, res) => {
    try {
        const doctor = await doctorRepository.findDoctorByUserId(res.locals.user.id)
        await commentRepository.makeCommentShowAfterCheck(doctor.id)
        res.json({message: "makeCommentShowAfterCheck success operation", result: doctor})
    } catch (e) {
        console.log("makeCommentShowAfterCheck error: ", e.message)
        res.status(500).json({"makeCommentShowAfterCheck error": e.message})
    }
}


const likeComment = async (req, res) => {
    try {
        const result = await commentRepository.likeComment(req.params.commentId, res.locals.user.id)
        res.json({message: "likeComment success operation", result: result})
    } catch (e) {
        console.log("likeComment error: ", e.message)
        res.status(500).json({"likeComment error": e.message})
    }
}


const dislikeComment = async (req, res) => {
    try {
        const result = await commentRepository.dislikeComment(req.params.commentId, res.locals.user.id)
        res.json({message: "dislikeComment success operation", result: result})
    } catch (e) {
        console.log("dislikeComment error: ", e.message)
        res.status(500).json({"dislikeComment error": e.message})
    }
}


const findAllShownCommentOfDoctor = async (req, res) => {
    try {
        const result = await commentRepository.findAllShownCommentOfDoctor(req.query.doctorId)
        res.json({message: "findAllShownCommentOfDoctor success operation", result: result})

    } catch (e) {
        console.log("findAllShownCommentOfDoctor error: ", e.message)
        res.status(500).json({"findAllShownCommentOfDoctor error": e.message})
    }
}


const findAllPendingCommentOfDoctor = async (req, res) => {
    try {
        const doctor = await doctorRepository.findDoctorByUserId(res.locals.user.id)
        if (doctor.id === req.query.doctorId) {
            const result = await commentRepository.findAllPendingCommentOfDoctor(req.query.doctorId)
            res.json({message: "findAllPendingCommentOfDoctor success operation", result: result})
        } else {
            res.status(403).json({message: "doctor can see list of his/her own pending comments"})

        }

    } catch (e) {
        console.log("findAllPendingCommentOfDoctor error: ", e.message)
        res.status(500).json({"findAllPendingCommentOfDoctor error": e.message})
    }
}


const showUsersListOfCommentsThatDisLike = async (req, res) => {
    try {
        const result = await commentRepository.showUserDisLikeList(res.locals.user.id)
        res.json({message: "showUsersListOfCommentsThatDisLike success operation", result: result})

    } catch (e) {
        console.log("showUsersListOfCommentsThatDisLike error: ", e.message)
        res.status(500).json({"showUsersListOfCommentsThatDisLike error": e.message})
    }
}

const showUsersListOfCommentsThatLike = async (req, res) => {
    try {
        const result = await commentRepository.showUserLikeList(res.locals.user.id)
        res.json({message: "showUsersListOfCommentsThatLike success operation", result: result})

    } catch (e) {
        console.log("showUsersListOfCommentsThatLike error: ", e.message)
        res.status(500).json({"showUsersListOfCommentsThatLike error": e.message})
    }
}


router.post('/', checkAccess.validateJwt, sendComment);
router.get('/shown', findAllShownCommentOfDoctor);
router.get('/pending', checkAccess.validateJwt, findAllPendingCommentOfDoctor);
router.get('/likeList', checkAccess.validateJwt, showUsersListOfCommentsThatLike);
router.get('/disLikeList', checkAccess.validateJwt, showUsersListOfCommentsThatDisLike);
router.put('/delete/:commentId', checkAccess.validateJwt, deleteComment);
router.put('/edit/:commentId', checkAccess.validateJwt, editComment);
router.put('/accept/:commentId', checkAccess.validateJwt, acceptCommentToShow);
router.put('/reject/:commentId', checkAccess.validateJwt, rejectCommentToShow);
router.put('/deactivateComment', checkAccess.validateJwt, deactivateCommenting);
router.put('/makeCommentShowAfterCheck', checkAccess.validateJwt, makeCommentShowAfterCheck);
router.put('/likeComment/:commentId', checkAccess.validateJwt, likeComment);
router.put('/dislikeComment/:commentId', checkAccess.validateJwt, dislikeComment);
module.exports = router;