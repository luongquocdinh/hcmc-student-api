
module.exports = function (data) {
    let mailOptions = {
        from: '<hcmc.students@gmail.com>',
        to: data.email,
        fromName: "HCMC STUDENTS ADMIN",
        subject: 'Welcome to HCMC STUDENTS',
        text: 'Hello ' + data.email,
        html: `
            <b>Cám ơn bạn đã sử dụng ứng dụng của chúng tôi.</b>
            <p>Đây là mã thẻ cào của bạn</p>
            Serial:` + data.serial + `<br />` +
            `Mã thẻ: ` + data.code + `<br />` +
            `Nhà mạng: ` + data.network + `<br />` +
            `Giá trị: ` + data.value + `.000 VNĐ`
    };
    return mailOptions
}