
module.exports = function (data) {
    let mailOptions = {
        from: '<hcmc.students@gmail.com>',
        to: data.email,
        fromName: "HCMC STUDENTS ADMIN",
        subject: 'Welcome to HCMC STUDENTS',
        text: 'Hello',
        html: `<!DOCTYPE html>
        <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en" dir="ltr">
        <head>
          <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width, user-scalable=no" />
        
          <style type="text/css" media="screen">
            .headerRow a, .valuesBlock a{
              color:  !important;
              text-decoration: none !important;
            }
            @media screen and (max-width:525px){
              body > table{
                width: 100% !important;
              }
              .headerRow > span{
                display:block;
                clear:both;
                text-align: center !important;
                line-height: 26px;
              }
              .headerRow img{
                float:none !important;
                margin: 10px auto !important;
                display:block !important;
                align: none !important;
              }
              .outerMargin{
                width: 20px !important;
              }
              .topBottomMargin{
                height: 20px !important;
              }
              .poweredByKudos{
                display: block !important;
                clear:both !important;
                width: 100% !important;
                font-size: 9px !important;
                padding-top: 30px;
              }
              .actionArea{
                display: block !important;
                clear:both !important;
                width: 100% !important;
              }
              .headerSpacer{
                height: 10px !important;
              }
              .weeklyActivityMessageDate, .weeklyActivityMessageLink{
                width: 100% !important;
                clear: both !important;
                float: none !important;
                display: block !important;
              }
              .weeklyActivityMessageLink{
                padding-top: 10px;
              }
              .weeklyActivityReceivers{
                padding-bottom: 25px !important;
              }
            }
          </style>
        
        </head>
        
          <body style="background-color:#e6e6e6;font-family: Helvetica, "Helvetica Neue", Arial, Geneva, sans-serif;font-size:15px;color:#666;line-height:24px;">
              <style type="text/css" media="screen">
            p, ol, table{
              font-size:15px;
              color:#444444;
              line-height:24px;
              font-family: Helvetica, "Helvetica Neue", Arial, Geneva, sans-serif;
            }
            h1, h2, h3, h4, h5{
              font-family: Helvetica, "Helvetica Neue", Arial, Geneva, sans-serif;
            }
            h1 span{
              display:block;
            }
            h3, p, ol{
              margin: 15px 0;
            }
            .headerRow img{
              max-width: 100%;
            }
          </style>
        
          <table height="50" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td>&nbsp;
        
              </td>
            </tr>
          </table>
          <table width="580" border="0" cellspacing="0" cellpadding="0" style="margin:0 auto;border: 1px solid #B2B2B2;background-color:#ffffff;width:580px;font-family: Helvetica, 'Helvetica Neue', Arial, Geneva, sans-serif;font-size:15px;color:#666;line-height:24px;">
            <tr>
          <td>
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td height="40" class="topBottomMargin"></td>
              </tr>
              <tr>
                <td width="40" class="outerMargin">&nbsp;</td>
                <td align="center" style="vertical-align:middle;max-width:500px;font-family: Helvetica,Arial,Geneva,sans-serif; font-weight:300; font-size:20px; color: #7FA52E;line-height:45px;" class="headerRow" dir="ltr">
                    <img alt="" align="center" valign="middle" style="vertical-align:middle;margin: 0 10px 0 0; width: 250px;" src="http://res.cloudinary.com/hwjtqthls/image/upload/v1508400422/icon_pqj2y6.png" />
                  <br>
                    <span>HCMC STUDENT</span>
                </td>
                <td width="40" class="outerMargin">&nbsp;</td>
              </tr>
              <tr>
                <td height="25" class="headerSpacer"></td>
              </tr>
            </table>
          </td>
        </tr>
        
            <tr>
              <td>
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td width="40" class="outerMargin">&nbsp;</td>
                    <td style="vertical-align:top;max-width:500px;" dir="ltr">
                      <h1 style="font-size:16px;color:#444444;line-height:19px">
        
                        <span style="font-weight:normal;">Hi `+data.name+`,</span>
                      </h1>
                      <div style="">
                        <p>
                          <p> Chào mừng bạn đến với Ứng dụng hệ thống thông tin sinh viên thành phố Hồ Chí Minh. Vui lòng bấm vào xác thực để xác thực tài khoản đăng kí của bạn. </p>
                        </p>
                      </div>
                    </td>
                    <td width="40" class="outerMargin">&nbsp;</td>
                  </tr>
                  <tr>
                    <td width="40" class="outerMargin">&nbsp;</td>
                    <td style="vertical-align:top;max-width:500px;border-top:1px solid #ccc;border-bottom:1px solid #ccc;text-align:center;padding-bottom:25px;" dir="ltr">
                      <p>
                         
                      </p>
                      <div style="background:#444444; border-radius:3px; text-align:center;margin:0 auto; max-width: 75%;">
                        <a href="https://hcmc-student-api.herokuapp.com/user/active/`+ data.token +`" style=" color:#fff; font-weight:bold; text-decoration:none; font-size:12px;line-height:17px;display:block;padding:10px 35px;"><span style="color:#fff;">Xác thực</span></a>
                      </div>
                    </td>
                    <td width="40" class="outerMargin">&nbsp;</td>
                  </tr>
                  <tr>
                    <td width="40" class="outerMargin">&nbsp;</td>
                    <td style="vertical-align:top;max-width:500px;" dir="ltr">
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td height="20"></td>
                        </tr>
                        <tr>
                          <td width="100%" style="font-size:10px;text-transform:uppercase;vertical-align:bottom;line-height:22px;" class="poweredByKudos" dir="ltr">
                              <div align="right">
                              HCMC STUDENT team.
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td width="40" class="outerMargin">&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td height="40" class="topBottomMargin"></td>
            </tr>
          </table>
          </body>
        </html>        
        `
    };
    return mailOptions
}