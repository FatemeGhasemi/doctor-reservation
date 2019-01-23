require('dotenv').config();
// const db = require('./db/sequelize-connection');
const userSchema = require('./models/user');
const category = require('./models/category');
const office = require('./models/office');
const reservation = require('./models/reservation');
const doctor = require('./models/doctor');
// const Sequelize = require('sequelize');



userSchema.userSchema().then(res=>{console.log(res)})
doctor.doctorSchema().then(res=>{console.log(res)})
reservation.reservationSchema().then(res=>{console.log(res)})
office.officeSchema().then(res=>{console.log(res)})
category.categorySchema().then(res=>{console.log(res)})