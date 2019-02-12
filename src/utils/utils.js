const datetime = require('node-datetime');
const moment = require('moment')


const getRandomFourDigitNumber = async () => {
    return Math.floor(1000 + Math.random() * 9000);
};


const ifTodayIsAtLeastOneDayBefore = async (time) => {
    try {
        // let time = "2019-02-11 21:59:10.634+03:30"
        time = time.split(" ")[0]
        console.log("time: ", time)
        const day = time.split("-")[2]
        const month = time.split("-")[1]
        const year = time.split("-")[0]
        let now = datetime.create();
        now = now.format('m/d/Y');
        const nowDay = now.split('/')[1]
        const nowMonth = now.split('/')[0]
        const nowYear = now.split('/')[2]
        return (nowYear <= year && nowMonth <= month && nowDay < day)

    } catch (e) {
        console.log(e.message)
    }
};


const towTimeDifferenceInMinutes = async (finishTime,startTime) => {
    let startDate = moment(startTime);
    let finishDate = moment(finishTime)
    let duration = moment.duration(finishDate.diff(startDate));
    let minutes = duration.asMinutes();
    return minutes
};


module.exports = {getRandomFourDigitNumber, ifTodayIsAtLeastOneDayBefore, towTimeDifferenceInMinutes}