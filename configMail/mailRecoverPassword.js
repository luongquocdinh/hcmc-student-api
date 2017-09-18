
module.exports = function (email, token) {
    let mailOptions = {
        from: '<hcmc.students@gmail.com>',
        to: email,
        fromName: "HCMC STUDENTS ADMIN",
        subject: 'Welcome to HCMC STUDENTS',
        text: 'Hello',
        html: `
            Mã đổi lại mật khẩu mới: <b>` + token + `</b><br />`
        + `<b> Mã chỉ được sử dụng 1 lần </b>`
    };
    return mailOptions
}

