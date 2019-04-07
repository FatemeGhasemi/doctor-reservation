const express = require('express');
const userRepository = require('../../repositories/user');
const checkAccess = require('../../middlewares/authentication');

const router = express.Router();


const addToFavoriteList = async (req,res)=>{
    try {
       const result = await userRepository.addFavorite(req.params.phoneNumber,req.body.doctorId)
        res.json({message: "addToFavoriteList operation succeed",result:result})

    }catch (e) {
        console.log("addToFavoriteList ERROR: ", e.message);
        res.status(500).json({message: "addToFavoriteList operation failed",result:e.message})
    }
}


const removeFromFavoriteList = async (req,res)=>{
    try {
        const result = await userRepository.removeFavorite(req.params.phoneNumber,req.body.doctorId)
        res.json({message: "removeFromFavoriteList operation succeed",result:result})

    }catch (e) {
        console.log("removeFromFavoriteList ERROR: ", e.message);
        res.status(500).json({message: "removeFromFavoriteList operation failed",result:e.message})
    }
}


const getListOfUserFavorite = async (req,res)=>{
    try {
        const result = await userRepository.getListOfFavorite(res.locals.user.phoneNumber)
        console.log(result)
        res.json({message: "getListOfUserFavorite operation succeed",result:result})

    }catch (e) {
        console.log("getListOfUserFavorite ERROR: ", e.message);
        res.status(500).json({message: "getListOfUserFavorite operation failed",result:e.message})
    }
}





router.put('/:phoneNumber',checkAccess.validateJwt,checkAccess.checkAccess ,addToFavoriteList);
router.delete('/:phoneNumber',checkAccess.validateJwt,checkAccess.checkAccess ,removeFromFavoriteList);
router.get('/',checkAccess.validateJwt,getListOfUserFavorite);

module.exports = router;