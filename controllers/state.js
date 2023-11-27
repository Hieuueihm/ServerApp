const State = require('../models/stateModel')
const Log = require('../models/logModel')
const handlePostStateData = async (req, res) => {
    const { steps, timeSleep, heartRate, spo2, co2, no2 } = req.body;
    try {
        const currentDate = new Date();

        // Đặt giờ, phút, giây và mili-giây của đối tượng Date thành 0
        currentDate.setHours(0, 0, 0, 0);

        // Lấy timestamp từ đối tượng Date đã được cập nhật
        const timestampForDay = currentDate.getTime();


        const existingLog = await Log.findOne({});
        const { prevLog, currentLog, objectId } = existingLog;
        const existingState = await State.findOne({ objectId });
        if (existingState) {
            if (currentLog == false) {
                // đây là trạng thái cập nhật

                const existingDay = await existingState.days.find(day => day.day == timestampForDay)
                if (existingDay) {
                    // Collection đã tồn tại, cập nhật nó
                    existingDay.step = steps;
                    existingDay.sleep = {
                        startTime: new Date(),
                        endTime: new Date()
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
                } else {
                    const newExtDay = {
                        // Add properties for the new extDay as needed
                        day: timestampForDay,
                        step: steps,
                        sleep: {
                            startTime: new Date(),
                            endTime: new Date()
                        },
                        heartRate: {
                            currentHeartRate: heartRate,
                            currentSpo2: spo2,
                            avgHeartRate: [],
                            avgSpo2: []
                        }
                    };

                    existingState.days.push(newExtDay)

                    // Add newExtDay to your collection or use it as needed
                    // For example, if you have an array, you can push it:

                }
                existingState.airQuality = {
                    co2: co2,
                    no2: no2,
                    timestamps: new Date().getTime()
                }
                await existingState.save()
                return res.status(200).json({ success: true, message: "update data", isChangeUser: false });
            } else if (currentLog == true) {
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
                        startTime: new Date(),
                        endTime: new Date()
                    },
                    step: steps,
                    heartRate: {
                        currentHeartRate: 0,
                        currentSpo2: 0,
                        avgHeartRate: [newAvgHeartRate],
                        avgSpo2: [newAvgSpo2]
                    }
                }],
                airQuality: {
                    co2: 0,
                    no2: 0,
                    timestamps: new Date().getTime()
                }
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
        const { currentLog, objectId } = existingLog;

        let existingState = await State.findOne({ objectId });

        if (existingState) {
            const existingDay = existingState.days.find(day => day.day == timestampForDay);

            if (existingDay) {
                // Return specific information for the existing day
                return res.status(200).json({
                    success: true,
                    message: "data found",
                    todayInfo: existingDay
                });
            } else {
                // If no data for the current day is found, you might decide to return an empty object or a specific message
                return res.status(202).json({
                    success: true,
                    message: "no data for the current day",
                    todayInfo: {}
                });
            }
        } else {
            // If no existing state is found, you might decide to return an empty object or a specific message
            return res.status(200).json({
                success: true,
                message: "no existing state found",
                isChangeUser: true,
                todayInfo: {}
            });
        }



    } catch (error) {
        console.error('Error handle get State document:', error);
        res.status(404).json({ success: false, error: 'Internal Server Error' });

    }
}
module.exports = {
    handlePostStateData: handlePostStateData,
    handleGetStateData, handleGetStateData
}