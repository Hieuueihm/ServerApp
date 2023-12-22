const User = require('../models/userModel')
const State = require('../models/stateModel')
const { sendEmailCaptcha, sendMailResponse } = require('../utils/mailer')
const messageContent = require('../utils/messageContent');
const Message = require('../models/messageModel')
require("dotenv").config()

const getCaptcha = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            const captcha = Math.floor(100000 + Math.random() * 900000);
            const newUser = new User({ email, captcha });
            await newUser.save();
            sendEmailCaptcha(email, messageContent(email, captcha), captcha);
            return await res.json({ status: 200, captcha }); // Trả về trạng thái và captcha
        } else {
            if (user.captcha && Date.now() - user.updatedAt.getTime() <= 15 * 60 * 1000) {
                // Nếu user đã tồn tại và captcha còn hiệu lực, sử dụng lại captcha cũ
                sendEmailCaptcha(email, messageContent(email, user.captcha), user.captcha);
                return await res.json({ status: 200, captcha: user.captcha });
            } else {
                const captcha = Math.floor(100000 + Math.random() * 900000);
                user.captcha = captcha;
                await user.save();
                sendEmailCaptcha(email, messageContent(email, captcha), captcha);
                return await res.json({ status: 200, captcha });
            }
        }

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error"); // Trả về lỗi server nếu có lỗi
    }
}

const handleLogin = async (req, res) => {
    const { email, captcha, fcmtoken } = req.body;
    // console.log(req.body)

    try {
        // Tìm kiếm user với email và captcha
        const user = await User.findOne({ email, captcha });

        if (user) {
            user.fcmtoken = fcmtoken;
            await user.save();
            // Nếu user tồn tại, đồng thời email và captcha hợp lệ
            return res.json({ status: 200, message: "Login successful", _id: user._id, isNewUser: user.isNewUser });
        } else {
            // Nếu không tìm thấy user hoặc email và captcha không hợp lệ
            return res.json({ status: 401, message: "Invalid email or captcha" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const handleLoginWithFacebook = async (req, res) => {
    const { email, name, fcmtoken } = req.body;
    console.log(email)

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            existingUser.fcmtoken = fcmtoken;
            await existingUser.save();
            return res.json({ success: true, message: 'Đăng nhập thành công', _id: existingUser._id, isNewUser: existingUser.isNewUser });
        } else {
            const newUser = new User({ email, name });
            newUser.fcmtoken = fcmtoken;
            await newUser.save();



            return res.json({ success: true, message: 'Tạo tài khoản thành công', _id: newUser._id, isNewUser: newUser.isNewUser });
        }
    } catch (error) {
        return res.json({ success: false, error: error.message });
    }
}

const handleGetInformation = async (req, res) => {
    try {
        const { user_id } = req.body;
        if (!user_id) {
            return res.json({ success: false, error: "Missing user_id" });
        }
        const userInfo = await User.findById(user_id);

        if (userInfo) {
            return res.json({ success: true, userInfo: userInfo });
        } else {
            return res.json({ success: false, error: "User not found" });
        }

    } catch (error) {
        return res.json({ success: false, error: error.message });
    }

}

const handleEditInformation = async (req, res) => {
    try {
        const { user_id, name, dateOfBirth, gender, height, weight } = req.body;
        const user = await User.findById(user_id);

        if (!user) {
            return res.json({ success: false, error: "User not found" });
        }
        user.name = name;
        user.dateOfBirth = dateOfBirth;
        user.gender = gender;
        user.height = height;
        user.weight = weight;
        user.kcalRate = 175;
        user.distanceFootRate = 75; // m
        user.isNewUser = false;
        if (req.file) {
            user.avatar = req.file.path;
        }

        await user.save();

        return res.json({ success: true, message: "User information updated successfully" });


    } catch (error) {
        return res.json({ success: false, error: error.message });


    }
}
const handleUpdateTarget = async (req, res) => {
    try {
        const { user_id, targetStep, reminderDay, reminderTime, isReminder, dailyStartTime } = req.body;
        const user = await User.findById(user_id);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        // Lấy timestamp từ đối tượng Date đã được cập nhật
        const timestampForDay = currentDate.getTime();

        if (!user) {
            return res.json({ success: false, error: "User not found" });
        }
        const kcalRate = user.kcalRate;
        const height = user.height;

        user.targetStep = targetStep;
        const result = targetStep * (kcalRate / 10000) * height;
        const resultInteger = parseInt(result, 10);
        user.targetKcal = resultInteger;
        user.reminderDay = reminderDay;
        user.reminderTime = reminderTime;
        user.isReminder = isReminder;
        user.dailyStartTime = dailyStartTime;
        user.hasTrainingSchedule = true;
        user.timeScheduleCreated = timestampForDay


        await user.save();

        return res.json({ success: true, message: "User target updated successfully" });

    } catch (error) {
        return res.json({ success: false, error: error.message });


    }
}

const handleUpdateReceiveNotification = async (req, res) => {
    try {
        const { user_id, isReceiveNotification } = req.body;
        const user = await User.findById(user_id);
        if (!user) {
            return res.json({ success: false, error: "User not found" });
        }
        user.isReceiveNotification = isReceiveNotification
        await user.save()
        return res.json({ success: true, message: "User notification updated successfully" });

    } catch (error) {
        return res.json({ success: false, error: error.message });

    }
}
const handleLogout = async (req, res) => {
    try {
        const { user_id, fcmtoken } = req.body;
        const user = await User.findById(user_id);
        if (!user) {
            return res.json({ success: false, error: "User not found" });
        }
        user.fcmtoken = fcmtoken;
        await user.save();
        return res.json({ success: true, message: "User Logout successfully" })
    } catch (error) {
        return res.json({ success: false, error: error.message });
    }
}
const handleDeleteTarget = async (req, res) => {
    try {
        const { user_id } = req.body;
        const user = await User.findById(user_id);
        if (!user) {
            return res.json({ success: false, error: "User not found" });
        }

        user.targetStep = null;
        user.reminderDay = null;
        user.reminderTime = null;
        user.isReminder = null;
        user.dailyStartTime = null;
        user.hasTrainingSchedule = false;
        user.timestampUpdated = "";
        user.targetCompleted = 0;
        user.timeScheduleCreated = "";


        await user.save();

        return res.json({ success: true, message: "User target updated successfully" });

    } catch (error) {
        return res.json({ success: false, error: error.message });


    }

}
const handleGetStateData = async (req, res) => {
    try {
        const { objectId } = req.body;
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const timestampForDay = currentDate.getTime();
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
        console.log(error);
        return res.status(400).json({ success: false })
    }
}
const handleGetAllStateData = async (req, res) => {
    try {
        const { objectId } = req.body;


        let existingState = await State.findOne({ objectId: objectId });

        if (existingState) {
            return res.status(200).json({ success: 'true', data: existingState });
        } else {
            return res.status(200).json({ success: false, data: {} })
        }

    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false });
    }
}


const handleAchieveResponseFromUser = async (req, res) => {
    try {
        const { userName, email, message } = req.body;
        const newMessage = new Message({
            name: userName,
            email: email,
            message: message
        });

        await newMessage.save();

        sendMailResponse(process.env.MAIL_ADMIN, message);

        return res.status(200).json({ success: true })




    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false });
    }
}

module.exports = {
    getCaptcha: getCaptcha,
    handleLogin: handleLogin,
    handleLoginWithFacebook: handleLoginWithFacebook,
    handleEditInformation: handleEditInformation,
    handleGetInformation: handleGetInformation,
    handleUpdateTarget: handleUpdateTarget,
    handleUpdateReceiveNotification: handleUpdateReceiveNotification,
    handleLogout: handleLogout,
    handleDeleteTarget: handleDeleteTarget,
    handleGetStateData: handleGetStateData,
    handleGetAllStateData: handleGetAllStateData,
    handleAchieveResponseFromUser
}