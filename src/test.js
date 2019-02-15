const datetime = require('node-datetime');
const moment = require('moment')


const cancelReserve = async () => {
    let timeString1 = "2019-05-09 22:00:00";
    let startDate;
    let returnedEndDate
    let x = [];
    startDate = moment(timeString1);
    for (let i = 0; i <= 5; i++) {
        returnedEndDate = moment(startDate).add(15, 'minute');
        startDate = returnedEndDate;
        x.push(returnedEndDate)
    }

    console.log("x: ",x)
    return x

};

cancelReserve().then(res=>{
    console.log(res)
})




// let final = returnedEndDate.isSame(finishDate)  // true
// console.log("final: ",final)
// let duration = moment.duration(finishDate.diff(startDate));
// // console.log("duration: ",duration)
//
// let minutes = duration.asMinutes();
// console.log("minutes: ",minutes)
//