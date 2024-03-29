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
        // const doctor = await doctorRepository.findDoctorByOfficeId(req.body.officeId)
        const office = await officeRepository.findOfficeById(req.body.officeId)
        if (office.commentAccessAbility === "showAfterCheck") {
            req.body.status = "pendingToShow"
            const result = await commentRepository.createComment(req.body)
            res.json({message: "sendComment success operation", result: result})
        } else if (office.commentAccessAbility === "isShown") {
            req.body.status = "isShown"
            const result = await commentRepository.createComment(req.body)
            res.json({message: "sendComment success operation", result: result})
        } else if (office.commentAccessAbility === "deActiveComments") {
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
            if (user.role === "user") {
                if (res.locals.user.id === comment.userId) {
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
        const comment = await commentRepository.findCommentById(req.params.commentId)
        const user = await userRepository.findUserById(res.locals.user.id)
        const office = await officeRepository.findOfficeById(comment.officeId)
        if (user.role === "secretary") {
            const secretary = await secretaryRepository.findSecretaryByUserId(res.locals.user.id)
            if (office.secretaryId === secretary.id && office.commentAccessAbility === "showAfterCheck"
                && comment.status === "pendingToShow") {
                const result = await commentRepository.allowCommentToShow(req.params.commentId)
                res.json({message: "acceptCommentToShow success operation", result: result[1]})

            }
            else {
                res.json({message: "just doctor or his/her secretary can accept comments"})
            }
        }
        if (user.role === "doctor") {
            const doctor = await doctorRepository.findDoctorByUserId(res.locals.user.id)
            if (doctor.id === office.doctorId && office.commentAccessAbility === "showAfterCheck"
                && comment.status === "pendingToShow") {
                const result = await commentRepository.allowCommentToShow(req.params.commentId)
                res.json({message: "acceptCommentToShow success operation", result: result[1]})
            }
            else {
                res.json({message: "just doctor or his/her secretary can accept comments"})
            }
        } else {
            res.json({message: "just doctor or his/her secretary can accept comments"})
        }

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
            if (office.secretaryId === secretary.id && office.commentAccessAbility === "showAfterCheck"
                && comment.status === "pendingToShow") {
                result = await commentRepository.rejectCommentToShow(req.params.commentId)
            }
        }
        if (user.role === "doctor") {
            const doctor = await doctorRepository.findDoctorByUserId(res.locals.user.id)
            if (doctor.id === office.doctorId && office.commentAccessAbility === "showAfterCheck"
                && comment.status === "pendingToShow") {
                result = await commentRepository.rejectCommentToShow(req.params.commentId)
            }
        } else {
            res.json({message: "just doctor and his/her secretary can reject comments"})
        }
        res.json({message: "rejectCommentToShow success operation", result: result})
    } catch (e) {
        console.log("rejectCommentToShow error: ", e.message)
        res.status(500).json({"rejectCommentToShow error": e.message})
    }
}


const makeCommentShowAfterCheck = async (req, res) => {
    try {
        const user = await userRepository.findUserById(res.locals.user.id)
        const office = await officeRepository.findOfficeById(req.params.officeId)
        if (user.role === "secretary") {
            const secretary = secretaryRepository.findSecretaryByUserId(res.locals.user.id)
            if (office.secretaryId === secretary.id) {
                const result = await commentRepository.makeCommentShowAfterCheck(office.id)
                res.json({message: "makeCommentShowAfterCheck success operation", result: result[1]})
            }
        }
        if (user.role === "doctor") {
            const doctor = await doctorRepository.findDoctorByUserId(res.locals.user.id)
            if (doctor.id === office.doctorId) {
                const result = await commentRepository.makeCommentShowAfterCheck(office.id)
                res.json({message: "makeCommentShowAfterCheck success operation", result: result[1]})

            }
        } else {
            res.json({message: "user cant have access"})
        }
    } catch (e) {
        console.log("makeCommentShowAfterCheck error: ", e.message)
        res.status(500).json({"makeCommentShowAfterCheck error": e.message})
    }
}


const deactivateCommenting = async (req, res) => {
    try {
        const user = await userRepository.findUserById(res.locals.user.id)
        const office = await officeRepository.findOfficeById(req.params.officeId)
        if (user.role === "secretary") {
            const secretary = secretaryRepository.findSecretaryByUserId(res.locals.user.id)
            if (office.secretaryId === secretary.id) {
                const result = await commentRepository.deactivateCommenting(office.id)
                res.json({message: "deactivateCommenting success operation", result: result[1]})

            }
        }
        if (user.role === "doctor") {
            const doctor = await doctorRepository.findDoctorByUserId(res.locals.user.id)
            if (doctor.id === office.doctorId) {
                const result = await commentRepository.deactivateCommenting(office.id)
                res.json({message: "deactivateCommenting success operation", result: result[1]})

            }
        } else {
            res.json({message: "user cant have access"})
        }
    } catch (e) {
        console.log("deactivateCommenting error: ", e.message)
        res.status(500).json({"deactivateCommenting error": e.message})
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
        const result = await commentRepository.findAllShownCommentOfDoctor(req.query.officeId)
        res.json({message: "findAllShownCommentOfDoctor success operation", result: result})

    } catch (e) {
        console.log("findAllShownCommentOfDoctor error: ", e.message)
        res.status(500).json({"findAllShownCommentOfDoctor error": e.message})
    }
}


const findAllPendingCommentOfDoctor = async (req, res) => {
    try {
        const user = userRepository.findUserById(res.locals.user.id)
        const office = await officeRepository.findOfficeById(req.query.officeId)
        if (user.role === "doctor") {
            const doctor = await doctorRepository.findDoctorByUserId(res.locals.user.id)
            if (doctor.id === office.doctorId) {
                const result = await commentRepository.findAllPendingCommentOfDoctor(req.query.officeId)
                res.json({message: "findAllPendingCommentOfDoctor success operation", result: result})
            }
        }
        if (user.role === "secretary") {
            const secretary = await secretaryRepository.findSecretaryByUserId(res.locals.user.id)
            if (secretary.id === office.secretaryId) {
                const result = await commentRepository.findAllPendingCommentOfDoctor(req.query.officeId)
                res.json({message: "findAllPendingCommentOfDoctor success operation", result: result})
            }
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


const showCommentsInPage = async (req,res)=>{
    try {
        const result = await commentRepository.showCommentsInPage(res.locals.user.id,req.query.officeId)
        res.json({message: "showCommentsInPage success operation", result: result})

    } catch (e) {
        console.log("showCommentsInPage error: ", e.message)
        res.status(500).json({"showCommentsInPage error": e.message})
    }
}


router.post('/', checkAccess.validateJwt, sendComment);
router.get('/shownCommentForEveryOne', findAllShownCommentOfDoctor);
router.get('/shownCommentForUsers',checkAccess.validateJwt, showCommentsInPage);
router.get('/pending', checkAccess.validateJwt, findAllPendingCommentOfDoctor);

// router.get('/likeList', checkAccess.validateJwt, showUsersListOfCommentsThatLike);
// router.get('/disLikeList', checkAccess.validateJwt, showUsersListOfCommentsThatDisLike);

router.put('/delete/:commentId', checkAccess.validateJwt, deleteComment);
router.put('/edit/:commentId', checkAccess.validateJwt, editComment);
router.put('/accept/:commentId', checkAccess.validateJwt, acceptCommentToShow);
router.put('/reject/:commentId', checkAccess.validateJwt, rejectCommentToShow);
router.put('/deactivateComment/:officeId', checkAccess.validateJwt, deactivateCommenting);
router.put('/makeCommentShowAfterCheck/:officeId', checkAccess.validateJwt, makeCommentShowAfterCheck);
router.put('/likeComment/:commentId', checkAccess.validateJwt, likeComment);
router.put('/dislikeComment/:commentId', checkAccess.validateJwt, dislikeComment);
module.exports = router;