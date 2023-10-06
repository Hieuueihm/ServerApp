const User = require('../models/userModel')
const sendMail = require('../utils/mailer')
const messageContent = require('../utils/messageContent');
const getCaptcha = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            const captcha = Math.floor(100000 + Math.random() * 900000);
            const newUser = new User({ email, captcha });
            await newUser.save();
            sendMail(email, messageContent(email, captcha), captcha);
            return await res.json({ status: 200, captcha }); // Trả về trạng thái và captcha
        } else {
            if (user.captcha && Date.now() - user.updatedAt.getTime() <= 15 * 60 * 1000) {
                // Nếu user đã tồn tại và captcha còn hiệu lực, sử dụng lại captcha cũ
                sendMail(email, messageContent(email, user.captcha), user.captcha);
                return await res.json({ status: 200, captcha: user.captcha });
            } else {
                const captcha = Math.floor(100000 + Math.random() * 900000);
                user.captcha = captcha;
                user.save();
                sendMail(email, messageContent(email, captcha), captcha);
                return await res.json({ status: 200, captcha });
            }
        }

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error"); // Trả về lỗi server nếu có lỗi
    }
}

const handleLogin = async (req, res) => {
    const { email, captcha } = req.body;
    // console.log(req.body)

    try {
        // Tìm kiếm user với email và captcha
        const user = await User.findOne({ email, captcha });

        if (user) {
            // Nếu user tồn tại, đồng thời email và captcha hợp lệ
            return res.json({ status: 200, message: "Login successful" });
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
    const { email, name } = req.body;
    console.log(email)

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.json({ success: true, message: 'Đăng nhập thành công' });
        } else {
            const newUser = new User({ email, name });
            await newUser.save();

            return res.json({ success: true, message: 'Tạo tài khoản thành công' });
        }
    } catch (error) {
        return res.json({ success: false, error: error.message });
    }
}
const handleLoginWithGithub = async (req, res) => {
    console.log("test")

}


module.exports = {
    getCaptcha: getCaptcha,
    handleLogin: handleLogin,
    handleLoginWithFacebook: handleLoginWithFacebook,
    handleLoginWithGithub: handleLoginWithGithub
}