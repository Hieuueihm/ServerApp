const messageContent = (email, captcha) => {
    return `
        Dear ${email} <br/>
        Your verification code is: ${captcha} <br/>
        The valid time is 15 minutes. <br/>
        Have a nice day!    <br/>
    `
}

module.exports = messageContent