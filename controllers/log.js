const Log = require('../models/logModel')

const handleGetCurrentLog = async (req, res) => {
    try {
        // Lấy thông tin log có timestamps mới nhất (currentLog)
        const currentLog = await Log.findOne({})

        // Lấy thông tin log ngay trước currentLog (prevLog)

        // Trả về kết quả
        res.status(200).json({ success: true, currentLog });
    } catch (error) {
        console.error('Error getting current log:', error);
        throw error; // Nếu có lỗi, bạn có thể xử lý hoặc lan truyền lỗi ra ngoài để báo cáo.
    }
}
const handleSetCurrentLog = async (req, res) => {
    try {
        const { current, path } = req.body;

        const existingLog = await Log.findOne({});
        if (existingLog) {
            existingLog.prevLog = existingLog.currentLog;
            existingLog.currentLog = current;
            existingLog.path = path;

            // Lưu lại bản ghi đã cập nhật
            const updatedLog = await existingLog.save();
            res.status(200).json({ success: true, updatedLog });
        } else {
            res.status(404).json({ success: false, error: "No log found in the collection" });

        }

    } catch (error) {
        console.log("error in handleSetCurrentlog", error)
        throw error
    }
}
module.exports = {
    handleGetCurrentLog: handleGetCurrentLog,
    handleSetCurrentLog: handleSetCurrentLog

}