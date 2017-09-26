
module.exports = function (data) {
    let mailOptions = {
        from: '<hcmc.students@gmail.com>',
        to: data.email,
        fromName: "HCMC STUDENTS ADMIN",
        subject: 'Welcome to HCMC STUDENTS',
        text: 'Hello ' + data.name,
        html: `
            Cám ơn bạn <b>` + data.name + ` </b>đã sử dụng ứng dụng của chúng tôi.
            <p>Đây là mã nhận thưởng của bạn</p>
            Serial: <b>` + data.serial + `</b><br />` +
            `Vật phẩm là: <b>` + data.reward + `</b><br />`
    };
    return mailOptions
}