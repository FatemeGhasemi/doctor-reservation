// const datetime = require('node-datetime');
// const moment = require('moment')
// const dates = [{date: "2019-03-25", start: "13:00:00", finish: "17:00:00", duration: 60}, {
//     date: "2019-03-30",
//     start: "13:00:00",
//     finish: "15:00:00",
//     duration: 30
// }, {date: "2019-03-27", start: "13:00:00", finish: "16:00:00", duration: 15}]
//
//
// const addd =  (startDate, reserveTimePeriodInMinute) => {
//     return moment(startDate).add(reserveTimePeriodInMinute, 'minute').format("YYYY-MM-DD HH:mm:ss")
// }
//
// const counter =  (timeStartString, numberOfReserves, reserveTimePeriodInMinute) => {
//     let timeString1 = timeStartString;
//     let startDate;
//     let returnedEndDate
//     startDate = moment(timeString1);
//     const s1 = startDate.format("YYYY-MM-DD HH:mm:ss")
//     let x = [s1];
//     for (let i = 0; i <= numberOfReserves - 1; i++) {
//         returnedEndDate = addd(startDate, reserveTimePeriodInMinute)
//         startDate = returnedEndDate;
//         x.push(returnedEndDate)
//     }
//     // console.log("x: ", x)
//     return x
// }
//
// const towTimesDifference =  (start, finish) => {
//     let duration = moment.duration(finish.diff(start)).asMinutes();
//     return duration
// }
//
// const dayHandler = async (dates) => {
//     let count = []
//     dates.forEach(async item => {
//         let startDate = moment(item.date + " " + item.start);
//         let finishDate = moment(item.date + " " + item.finish);
//         const durationTimeInMinute =  towTimesDifference(startDate,finishDate);
//         const numberOfReserves = durationTimeInMinute / item.duration;
//         const c =  counter(startDate, numberOfReserves, item.duration)
//         count.push(c)
//     })
//     return count
// }
//
// dayHandler(dates).then( res =>{
//     console.log(res)
// })

// require('dotenv').config();
// const db = require('./db/db')
// const express = require('express');
// const app = express();
// const bodyParser = require('body-parser');
// app.use(bodyParser.json());
//
// db.initDb().then(() => {
// }).catch(e => {
//     console.log("Error init db ", e.message)
//     throw e
// });
//
// const officeSchema = require('./models/office')();
//
//
// const findNearestsPoints = async (longitude, latitude)=>{
//     try {
//
//         return officeSchema.findAll({
//             attributes: {
//                 include: [
//                     [
//                         officeSchema.fn(
//                             'ST_Distance',
//                             Sequelize.col('location'),
//                             Sequelize.fn('ST_MakePoint', longitude, latitude)
//                         ),
//                         'distance'
//                     ]
//                 ]
//             },
//             where: Sequelize.where(
//                 Sequelize.fn(
//                     'ST_DWithin',
//                     Sequelize.col('location'),
//                     Sequelize.fn('ST_MakePoint', longitude, latitude),
//                     process.env.REDIUS_DISTANCE
//                 ),
//                 true
//             ),
//             order: Sequelize.literal('distance ASC')
//         });
//     }catch (e) {
//         console.log(e.message)
//     }
//
//
// };
//
// findNearestsPoints(10.3,4.6).then(res=>{console.log(res)})
const categoryRepository = require("../src/repositories/category");

const x = async ()=> {
    return await categoryRepository.findCategoryIdByAnArrayOfCategories(["darmangaran","dandanPezeshki","jarahOmoomi"])
}

console.log(x())
