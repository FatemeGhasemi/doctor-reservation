const commentSchema = require('../models/comment')();
const doctorSchema = require('../models/doctor')();
const userSchema = require('../models/user')();
const userRepository = require('../repositories/user');
const doctorRepository = require('../repositories/doctor');
const officeRepository = require('../repositories/office')
const utils = require('../utils/utils')

const userRateDoctor = (doctorId,userId)
