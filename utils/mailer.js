const nodemailer = require("nodemailer");
require("dotenv").config()
const sendEmailCaptcha = async (to, messageContent, captcha) => {
    try {
        //create transporter
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
        });
        //message obj
        const message = {
            to: to,
            subject: `[ADHFit] verification code [${captcha}]`,
            html: `
            ${messageContent}
            `,
        };
        //send the email
        const info = await transporter.sendMail(message);
        console.log("Message sent", info.messageId);
    } catch (error) {
        console.log(error);
        throw new Error("Email could not be sent");
    }
};

const sendMailResponse = async (to, messageContent) => {
    try {
        //create transporter
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
        });
        //message obj
        const message = {
            to: to,
            subject: `Response from user`,
            html: `
            ${messageContent}
            `,
        };
        //send the email
        const info = await transporter.sendMail(message);
        console.log("Message sent", info.messageId);
    } catch (error) {
        console.log(error);
        throw new Error("Email could not be sent");
    }
};

module.exports = {
    sendEmailCaptcha,
    sendMailResponse

};