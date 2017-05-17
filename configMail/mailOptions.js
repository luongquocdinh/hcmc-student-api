
module.exports = function (data) {
    let mailOptions = {
        from: '<hcmc.students@gmail.com>',
        to: data.email,
        fromName: "HCMC STUDENTS ADMIN",
        subject: 'Welcome to HCMC STUDENTS',
        text: 'Hello',
        html: `<b>Hello</b>
            <a href="https://hcmc-student-api.herokuapp.com/user/active/`+ data.token +`">Confirm account</a>
        `
    };
    return mailOptions
}