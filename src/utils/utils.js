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
const ifTodayIsAtLeastOneDayBefore = (time) => {
    try {
        // let time = "2019-02-11 21:59:10.634+03:30"
        let now = datetime.create();
        now = now.format('m/d/Y');
        let date = datetime.create(time);
        let then = date.format('m/d/Y')
        let start = moment(now);
        let end = moment(then);
        let duration = moment.duration(end.diff(start)).asDays();
        console.log("duration:", duration)

        return (duration >= 1)

    } catch (e) {
        console.log(e.message)
    }
};


const ifTimeIsOneWeekLaterThanToday = (time) => {
    try {
        // let time = "2019-02-11 21:59:10.634+03:30"
        let date = datetime.create(time);
        let then = date.format('m/d/Y')
        let now = datetime.create();
        now = now.format('m/d/Y');
        let start = moment(now);
        let end = moment(then);
        let duration = moment.duration(end.diff(start)).asDays();
        console.log("duration:", duration)
        if (duration > 8) {
            return true
        } else {
            return false
        }

    } catch (e) {
        console.log(e.message)
    }
};


const ifTime2IsBetweenTowOtherTime = (time1, time2, time3) => {
    try {
        // let time = "2019-02-11 21:59:10.634+03:30"
        let date1 = datetime.create(time1);
        let date2 = datetime.create(time2);
        let date3 = datetime.create(time3);
        date1 = date1.format('m/d/Y')
        date2 = date2.format('m/d/Y')
        date3 = date3.format('m/d/Y')
        let start = moment(date1);
        let middle = moment(date2);
        let end = moment(date3);
        return start <= middle <= end;

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
    console.log("duration:", duration)
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


const isDateInDates = async (dates, reserveDate) => {
    let validDate = []
    dates.forEach(item => {
        if (item.constructor !== Array) {
            const reserveWanted = item.split(" ")[0];
            if (reserveWanted === reserveDate) {
                console.log("item: ", item)
                validDate.push(item)
            }
        } else if (item.constructor === Array) {
            item.forEach(i => {
                const reserveWanted = i.split(" ")[0];
                if (reserveWanted === reserveDate) {
                    console.log("i: ", i)
                    validDate.push(i)
                }
            })
        }

    })
    console.log("validDate: ", validDate)
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
    isEmpty,
    ifTimeIsOneWeekLaterThanToday,
    ifTime2IsBetweenTowOtherTime

}
