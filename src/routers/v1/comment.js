const express = require('express');
const doctorRepository = require("../../repositories/doctor");
const commentRepository = require("../../repositories/comment");
const userRepository = require("../../repositories/user");
const checkAccess = require('../../middlewares/authentication');
const jwtHelper = require('../../services/athorization/jwt');
const router = express.Router();












router.put('', checkAccess.validateJwt, );


module.exports = router;