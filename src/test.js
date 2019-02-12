const datetime = require('node-datetime');
const moment = require('moment')


const cancelReserve = async () => {
    let timeString1 = "2019-05-09 21:59:10.634+03:30";
    let timeString2 = "2019-05-09 23:29:10.634+03:30";
    let startDate = moment(timeString1);
    let finishDate = moment(timeString2);
    let x = []
    console.log("finishDate: ",finishDate)
    for (let i = 0; i <= 5; i++) {
        let returnedEndDate = moment(startDate).add(15, 'minute');
        x.push(returnedEndDate)
    }

    console.log("x: ",x)

};

cancelReserve().then()




// let final = returnedEndDate.isSame(finishDate)  // true
// console.log("final: ",final)
// let duration = moment.duration(finishDate.diff(startDate));
// // console.log("duration: ",duration)
//
// let minutes = duration.asMinutes();
// console.log("minutes: ",minutes)
//