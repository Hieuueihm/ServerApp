const State = require('../models/stateModel')
const Log = require('../models/logModel')
const User = require('../models/userModel.js')
const KCAL = 10;
const moment = require('moment')
const handlePostStateData = async (req, res) => {
    const { steps, heartRate, spo2, co2, totalTimeSleep, lightTimeSleep, deepTimeSleep } = req.body;
    try {
        const currentDate = new Date();

        // Đặt giờ, phút, giây và mili-giây của đối tượng Date thành 0
        currentDate.setHours(0, 0, 0, 0);

        // Lấy timestamp từ đối tượng Date đã được cập nhật
        const timestampForDay = currentDate.getTime();


        const existingLog = await Log.findOne({});
        const { login, objectId } = existingLog;
        const existingState = await State.findOne({ objectId });

        const existingUser = await User.findById(objectId);
        var height = null;
        var kcalRate = null;
        var distanceFootRate = null;
        if (existingUser) {
            height = existingUser.height;
            distanceFootRate = existingUser.distanceFootRate;
            kcalRate = existingUser.kcalRate;
            const reminderDay = existingUser.reminderDay;
            const monday = moment(currentDate).startOf('isoWeek').toDate();

            const reminderDayTimestamps = reminderDay.map(dayAbbrev => {
                const dayTimestamp = moment(monday).day(dayAbbrev).startOf('day').unix() * 1000;
                return dayTimestamp;
            });
            if (steps > existingUser.targetStep && timestampForDay != existingUser.timestampUpdated &&
                reminderDayTimestamps.includes(timestampForDay)) {
                existingUser.timestampUpdated = timestampForDay
                existingUser.targetCompleted = existingUser.targetCompleted + 1;
                await existingUser.save()

            }
        }
        if (existingState) {

            if (login == false) {
                // đây là trạng thái cập nhật

                const existingDay = await existingState.days.find(day => day.day == timestampForDay)
                if (existingDay) {
                    // Collection đã tồn tại, cập nhật nó
                    existingDay.step = steps;
                    if (height != null && kcalRate != null) {
                        const result = steps * (kcalRate / 10000) * height;
                        const resultInteger = parseInt(result, 10);
                        existingDay.kcal = resultInteger
                    } else {
                        existingDay.kcal = 0;
                    }
                    if (distanceFootRate != null) {
                        const result = steps * (distanceFootRate / 100)
                        const resultInteger = parseInt(result, 10);
                        existingDay.distance = resultInteger;
                    } else {
                        existingDay.distance = 0;
                    }

                    existingDay.sleep = {
                        totalTimeSleep: totalTimeSleep,
                        lightTimeSleep: lightTimeSleep,
                        deepTimeSleep: deepTimeSleep
                    }

                    // Cập nhật thông tin heartRate nếu có
                    if (existingDay.heartRate) {
                        existingDay.heartRate.currentHeartRate = heartRate
                        existingDay.heartRate.currentSpo2 = spo2

                        const avgHeartRate = existingDay?.heartRate?.avgHeartRate;
                        const avgSpo2 = existingDay?.heartRate?.avgSpo2
                        const lastAvgHeartRateTimestamp = avgHeartRate.length > 0
                            ? avgHeartRate[avgHeartRate.length - 1].timestamp
                            : 0;


                        const heartRateTimeDifference = new Date().getTime() - lastAvgHeartRateTimestamp;


                        if (heartRateTimeDifference >= 30 * 60 * 1000) {
                            const randomAvgHeartRateValue = heartRate
                            const newAvgHeartRate = {
                                timestamp: new Date().getTime(),
                                value: randomAvgHeartRateValue
                            };
                            const newAvgSpo2 = {
                                timestamp: new Date().getTime(),
                                value: spo2
                            }

                            // Thêm vào mảng avgHeartRate
                            avgHeartRate.push(newAvgHeartRate);
                            avgSpo2.push(newAvgSpo2);

                            console.log("Created a new avgHeartRate, spo2");
                        }

                    }
                    existingDay.airQuality = {
                        co2: co2,
                        timestamps: new Date().getTime()
                    }
                } else {
                    const newExtDay = {
                        // Add properties for the new extDay as needed
                        day: timestampForDay,
                        step: 0,
                        kcal: 0,
                        distance: 0,
                        sleep: {
                            totalTimeSleep: 0,
                            lightTimeSleep: 0,
                            deepTimeSleep: 0
                        },
                        heartRate: {
                            currentHeartRate: 0,
                            currentSpo2: 0,
                            avgHeartRate: [],
                            avgSpo2: []
                        }
                        ,
                        airQuality: {
                            co2: 0,
                            timestamps: new Date().getTime()

                        }
                    };

                    await existingState.days.push(newExtDay)

                    // Add newExtDay to your collection or use it as needed
                    // For example, if you have an array, you can push it:

                }

                await existingState.save()
                return res.status(200).json({ success: true, message: "update data", isChangeUser: false });
            } else if (login == true) {
                return res.status(201).json({ success: true, message: "change user", isChangeUser: true })
            }
        } else {

            const newAvgHeartRateValue = 0;
            const newAvgSpo2Value = 0;

            const newAvgHeartRate = {
                timestamp: new Date().getTime(),
                value: newAvgHeartRateValue
            };

            const newAvgSpo2 = {
                timestamp: new Date().getTime(),
                value: newAvgSpo2Value
            };

            const newExistingState = new State({
                // Khai báo các trường khác của newExistingState nếu có,
                objectId: objectId,
                days: [{
                    day: timestampForDay,
                    sleep: {
                        totalTimeSleep: 0,
                        lightTimeSleep: 0,
                        deepTimeSleep: 0
                    },
                    step: 0,
                    kcal: 0,
                    distance: 0,
                    heartRate: {
                        currentHeartRate: 0,
                        currentSpo2: 0,
                        avgHeartRate: [newAvgHeartRate],
                        avgSpo2: [newAvgSpo2]
                    },
                    airQuality: {
                        co2: 0,
                        timestamps: new Date().getTime()
                    }
                }],

            });

            // Lưu vào cơ sở dữ liệu
            await newExistingState.save();

            console.log("Created a new State:", newExistingState);
            return res.status(201).json({ success: true, isChangeUser: true });
        }



    } catch (error) {
        console.error('Error handle Post State document:', error);
        res.status(404).json({ success: false, error: 'Internal Server Error' });
    }
}

const handleGetStateData = async (req, res) => {
    try {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const timestampForDay = currentDate.getTime();
        const existingLog = await Log.findOne({});
        const { login, objectId } = existingLog;


        let existingState = await State.findOne({ objectId: objectId });

        if (existingState) {
            const existingDay = await existingState.days.find(day => day.day == timestampForDay);

            if (existingDay) {
                // Return specific information for the existing day
                return res.status(200).json({
                    success: true,
                    message: "data found",
                    todayInfo: existingDay
                });
            } else {

                const newExtDay = {
                    // Add properties for the new extDay as needed
                    day: timestampForDay,
                    step: 0,
                    kcal: 0,
                    distance: 0,
                    sleep: {
                        totalTimeSleep: 0,
                        lightTimeSleep: 0,
                        deepTimeSleep: 0
                    },
                    heartRate: {
                        currentHeartRate: 0,
                        currentSpo2: 0,
                        avgHeartRate: [],
                        avgSpo2: []
                    },
                    airQuality: {
                        co2: 0,
                        timestamps: new Date().getTime()
                    }
                };


                await existingState.days.push(newExtDay)
                await existingState.save();

                return res.status(202).json({
                    success: true,
                    message: "no data for the current day",
                    todayInfo: newExtDay
                });
            }
        } else {
            // If no existing state is found, you might decide to return an empty object or a specific message
            const newAvgHeartRateValue = 0;
            const newAvgSpo2Value = 0;

            const newAvgHeartRate = {
                timestamp: new Date().getTime(),
                value: newAvgHeartRateValue
            };

            const newAvgSpo2 = {
                timestamp: new Date().getTime(),
                value: newAvgSpo2Value
            };

            const newExistingState = new State({
                // Khai báo các trường khác của newExistingState nếu có,
                objectId: objectId,
                days: [{
                    day: timestampForDay,
                    sleep: {
                        totalTimeSleep: 0,
                        lightTimeSleep: 0,
                        deepTimeSleep: 0
                    },
                    step: 0,
                    kcal: 0,
                    distance: 0,
                    heartRate: {
                        currentHeartRate: 0,
                        currentSpo2: 0,
                        avgHeartRate: [newAvgHeartRate],
                        avgSpo2: [newAvgSpo2]
                    },
                    airQuality: {
                        co2: 0,
                        timestamps: new Date().getTime()
                    }
                }],

            });

            // Lưu vào cơ sở dữ liệu
            await newExistingState.save();

            return res.status(203).json({
                success: true,
                message: "no existing state found",
                todayInfo: {}
            });
        }



    } catch (error) {
        console.error('Error handle get State document:', error);
        res.status(404).json({ success: false, error: 'Internal Server Error' });

    }
}
const handleGetAllStateData = async (req, res) => {
    try {

        const existingLog = await Log.findOne({});
        const { login, objectId } = existingLog;


        let existingState = await State.findOne({ objectId: objectId });

        if (existingState) {
            return res.status(200).json({ success: 'true', data: existingState });
        } else {
            return res.status(200).json({ success: false, data: {} })
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: 'false' })
    }
}
const handleGetWeeklyTimeSleep = async (req, res) => {
    try {
        const { objectId, currentTimeStamp } = req.body


        const existingState = await State.findOne({ objectId });
        // console.log(timestampsForWeek)
        if (existingState) {
            // const matchedDays = existingState.days
            //     .filter(day => timestampsForWeek.includes(parseInt(day.day)))
            //     .map(day => { return { 'sleep': day.sleep, 'timestamp': day.day } });
            // // console.log(matchedDays)
            data = existingState.days
            // console.log(data)


            return res.status(200).json({ success: true, data: data })
        } else {
            return res.status(200).json({ success: false, message: 'user doesnt exist' })
        }




    } catch (error) {
        console.error('Error handle get weekly time sleep', error);
        return res.status(400).json({ success: false })
    }
}
module.exports = {
    handlePostStateData: handlePostStateData,
    handleGetStateData, handleGetStateData,
    handleGetAllStateData: handleGetAllStateData,
    handleGetWeeklyTimeSleep
}