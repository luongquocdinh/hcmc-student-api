
module.exports = function (data) {
    let mailOptions = {
        from: 'HCMC ADMIN',
        to: data.email,
        subject: 'HCMC STUDENTS - Nhận mã điện thoại',
        text: 'Hello ' + data.email,
        html: `
            <b>Cám ơn bạn đã sử dụng ứng dụng của chúng tôi.</b>
            <p>Đây là mã thẻ cào của bạn</p>
            Serial:` + data.serial +
            `Mã thẻ: ` + data.code +
            `Nhà mạng: ` + data.network +
            `Giá trị: ` + data.value
    };
    return mailOptions
}