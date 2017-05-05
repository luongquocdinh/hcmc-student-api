
module.exports = function (email, token) {
    let mailOptions = {
        from: 'HCMC ADMIN',
        to: email,
        subject: 'Welcome to HCMC STUDENTS',
        text: 'Hello',
        html: `<b>Hello</b>
            <a href="http://localhost:3000/user/active/`+ token +`">Confirm account</a>
        `
    };
    return mailOptions
}