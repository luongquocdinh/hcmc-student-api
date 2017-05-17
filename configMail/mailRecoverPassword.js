
module.exports = function (email, token) {
    let mailOptions = {
        from: 'HCMC ADMIN',
        to: email,
        subject: 'HCMC STUDENTS - Recover Password',
        text: 'Hello',
        html: `<b>Click link - Set Password</b> <br>
            <a href="http://localhost:3000/user/recover/`+ token +`">Confirm account</a>
        `
    };
    return mailOptions
}