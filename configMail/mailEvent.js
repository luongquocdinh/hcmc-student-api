
module.exports = function (data, event) {
    let mailOptions = {
        from: '<hcmc.students@gmail.com>',
        to: data.email,
        fromName: "HCMC STUDENTS ADMIN",
        subject: 'Welcome to HCMC STUDENTS',
        text: 'Hi <b>' + data.name + '</b>',
        html: 
        `Cám ơn bạn <b> ` + data.name + `  </b>đã đăng kí tham gia sự kiện<b> ` + event.title + ` </b>.<br /> ` + 
        `Thời gian bắt đầu từ <b>` +  event.startDate + ` </b>đến<b> ` + event.endDate + `</b><br />` +
        `Thân <br />` + 
        `HCMC ADMIN`
    };
    return mailOptions
}

