const datetime = require('node-datetime');
const moment = require('moment')


const getRandomFourDigitNumber = async () => {
    return Math.floor(1000 + Math.random() * 9000);
};


const ifTodayIsAtLeastOneDayBefore = async (time) => {
    try {
        // let time = "2019-02-11 21:59:10.634+03:30"
        time = time.split(" ")[0];
        console.log("time: ", time);
        const day = time.split("-")[2];
        const month = time.split("-")[1];
        const year = time.split("-")[0];
        let now = datetime.create();
        now = now.format('m/d/Y');
        const nowDay = now.split('/')[1];
        const nowMonth = now.split('/')[0];
        const nowYear = now.split('/')[2];
        return (nowYear <= year && nowMonth <= month && nowDay < day)

    } catch (e) {
        console.log(e.message)
    }
};


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


const isReserveTimeInDates =  (dates,reserveTime)=>{
    let validDate = []
    dates.forEach(item=>{
        item.forEach(i=>{
            if (i === reserveTime){
                validDate.push(i)
            }
        })
    })
    if (validDate !== []){
        return true
    }
    if(validDate === []){
        return false
    }
}




module.exports = {
    getRandomFourDigitNumber,
    ifTodayIsAtLeastOneDayBefore,
    dayHandler,
    isReserveTimeInDates
}
