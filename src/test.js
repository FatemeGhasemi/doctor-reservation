const datetime = require('node-datetime');
const moment = require('moment')
const dates = [{date: "2019-03-25", start: "13:00:00", finish: "17:00:00", duration: 60}, {
    date: "2019-03-30",
    start: "13:00:00",
    finish: "15:00:00",
    duration: 30
}, {date: "2019-03-27", start: "13:00:00", finish: "16:00:00", duration: 15}]


const addd =  (startDate, reserveTimePeriodInMinute) => {
    return moment(startDate).add(reserveTimePeriodInMinute, 'minute').format("YYYY-MM-DD HH:mm:ss")
}

const counter =  (timeStartString, numberOfReserves, reserveTimePeriodInMinute) => {
    let timeString1 = timeStartString;
    let startDate;
    let returnedEndDate
    startDate = moment(timeString1);
    const s1 = startDate.format("YYYY-MM-DD HH:mm:ss")
    let x = [s1];
    for (let i = 0; i <= numberOfReserves - 1; i++) {
        returnedEndDate = addd(startDate, reserveTimePeriodInMinute)
        startDate = returnedEndDate;
        x.push(returnedEndDate)
    }
    // console.log("x: ", x)
    return x
}

const towTimesDifference =  (start, finish) => {
    let duration = moment.duration(finish.diff(start)).asMinutes();
    return duration
}

const dayHandler = async (dates) => {
    let count = []
    dates.forEach(async item => {
        let startDate = moment(item.date + " " + item.start);
        let finishDate = moment(item.date + " " + item.finish);
        const durationTimeInMinute =  towTimesDifference(startDate,finishDate);
        const numberOfReserves = durationTimeInMinute / item.duration;
        const c =  counter(startDate, numberOfReserves, item.duration)
        count.push(c)
    })
    return count
}

dayHandler(dates).then( res =>{
    console.log(res)
})