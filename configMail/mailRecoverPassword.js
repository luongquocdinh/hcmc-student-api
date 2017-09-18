
module.exports = function (email, token) {
    let mailOptions = {
        from: '<hcmc.students@gmail.com>',
        to: email,
        fromName: "HCMC STUDENTS ADMIN",
        subject: 'Welcome to HCMC STUDENTS',
        text: 'Hello',
        html: `<b>Click link - Set Password</b> <br>
            <a href="https://hcmc-student-api.herokuapp.com/user/recover/`+ token +`">Confirm account</a>
        `
    };
    return mailOptions
}

