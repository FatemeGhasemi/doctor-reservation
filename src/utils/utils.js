const datetime = require('node-datetime');
const moment = require('moment')


/**
 *
 * @returns {Promise<number>}
 */
const getRandomFourDigitNumber = async () => {
    return Math.floor(1000 + Math.random() * 9000);
};


/**
 *
 * @param time
 * @returns {Promise<boolean>}
 */
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


/**
 *
 * @param startDate
 * @param reserveTimePeriodInMinute
 * @returns {string}
 */
const addd = (startDate, reserveTimePeriodInMinute) => {
    return moment(startDate).add(reserveTimePeriodInMinute, 'minute').format("YYYY-MM-DD HH:mm:ss")
}


/**
 *
 * @param timeStartString
 * @param numberOfReserves
 * @param reserveTimePeriodInMinute
 * @returns {string[]}
 */
const counter = (timeStartString, numberOfReserves, reserveTimePeriodInMinute) => {
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
    return x
}


/**
 *
 * @param start
 * @param finish
 * @returns {number}
 */
const towTimesDifference = (start, finish) => {
    let duration = moment.duration(finish.diff(start)).asMinutes();
    return duration
}


/**
 *
 * @param dates
 * @returns {Promise<Array>}
 */
const dayHandler = async (dates) => {
    let count = []
    dates.forEach(async item => {
        let startDate = moment(item.date + " " + item.start);
        let finishDate = moment(item.date + " " + item.finish);
        const durationTimeInMinute = towTimesDifference(startDate, finishDate);
        const numberOfReserves = durationTimeInMinute / item.duration;
        const c = counter(startDate, numberOfReserves, item.duration)
        count.push(c)
    })
    return count
}


/**
 *
 * @param dates
 * @param reserveTime
 * @returns {boolean}
 */
const isReserveTimeInDates = (dates, reserveTime) => {
    let validDate = []
    dates.forEach(item => {
        item.forEach(i => {
            if (i === reserveTime) {
                validDate.push(i)
            }
        })
    })
    if (validDate.length !== 0) {
        return true
    } else {
        return false
    }
}


const isDateInDates = (dates, reserveDate) => {
    let validDate = []
    dates.forEach(item => {
        if(item.length !==0) {
            const reserveWanted = item.split(" ")[0];
            if (reserveWanted === reserveDate) {
                validDate.push(item)
            }
        }
        else if(item.length ===0){
            item.forEach(i=>{
                const reserveWanted = i.split(" ")[0];
                if (reserveWanted === reserveDate) {
                    validDate.push(i)
                }
            })
        }

    })
    return validDate;
}


function isEmpty(obj) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}


module.exports = {
    getRandomFourDigitNumber,
    ifTodayIsAtLeastOneDayBefore,
    dayHandler,
    isReserveTimeInDates,
    isDateInDates,
    isEmpty

}
