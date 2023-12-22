const Log = require('../models/logModel')

const handleGetCurrentLog = async (req, res) => {
    try {
        // Lấy thông tin log có timestamps mới nhất (currentLog)
        const currentLog = await Log.findOne({})
        // console.log(currentLog)

        // Lấy thông tin log ngay trước currentLog (prevLog)

        // Trả về kết quả
        return res.status(200).json({ success: true, currentLog });
    } catch (error) {
        console.error('Error getting current log:', error);
        return res.status(400).json({ success: false })
    }
}
const handleSetCurrentLog = async (req, res) => {
    try {
        const { login, objectId } = req.body;
        // console.log(current, objectId)
        const existingLog = await Log.findOne({});
        if (existingLog) {
            existingLog.login = login;
            existingLog.objectId = objectId;

            // Lưu lại bản ghi đã cập nhật
            const updatedLog = await existingLog.save();
            return res.status(200).json({ success: true, updatedLog });
        } else {
            const newLog = new Log({
                login: login,
                objectId: objectId
            });

            // Lưu mới vào cơ sở dữ liệu
            const savedLog = await newLog.save();
            return res.status(200).json({ success: true, savedLog });

        }

    } catch (error) {
        console.log("error in handleSetCurrentlog", error)
        throw error
    }
}
const handleToggleCurrentLog = async (req, res) => {
    try {
        const existingLog = await Log.findOne({});
        if (existingLog) {
            existingLog.login = !existingLog.login;
            await existingLog.save();
            return res.status(200).json({ success: true, message: "toggle current log successfully" });
        }

    } catch (error) {
        console.log("error in handleSetCurrentlog", error)
        return res.status(404).json({ sucess: false, message: "error" });
    }
}
module.exports = {
    handleGetCurrentLog: handleGetCurrentLog,
    handleSetCurrentLog: handleSetCurrentLog,
    handleToggleCurrentLog: handleToggleCurrentLog

}