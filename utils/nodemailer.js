const nodemailer = require('nodemailer');

const config = {
     service: "gmail",
     host: "smtp.gmail.com",
     port: 465,
     secure: false,
     auth: {
         user: "moneywaracademy@gmail.com",
         pass: "oshwqabwwrwrgcqs"
     }
}

const sendMail = (email, otp, id) => {
     const transporter = nodemailer.createTransport(config);

     const mailOptions = {
         from: "moneywaracademy@gmail.com",
         to: email,
         subject: "التحقق من البريد الالكتروني",
         text: "لا تشارك الرمز مع احد!",
         html: `
          <div style="background-color: #0F0E0E; padding:1rem; border-radius: 8px; color:#fff; flex-direction: column; justify-content: center; align-items: center;">
          <br>
          <h1 style"font-size: 1rem;
          margin-bottom: 1rem;">Money War Academy Account</h1>
          <br>
          <h3>التحقق من البريد الالكتروني</h3>
          <p>يجب أن تكون رموز التحقق الخاصة بالبريد الإلكتروني سرية ولا يجب مشاركتها مع أي شخص آخر. قد يتم استغلال رمز التحقق من قبل الأشخاص الذين يسعون للوصول غير المصرح به إلى حسابك أو بياناتك الشخصية.
            <br>
            <b>سينتهي الرمز خلال 10 دقائق</b>
          </p> 
          <br>
            <a style="padding: 0.67rem 1.3rem; text-decoration: none; font-size: 1.1rem; margin: 1rem; background: #006FF8; color: #fff; border-radius: 6px;" href="http://127.0.0.1:3000/verify/${id}/${otp.replace(/\//g, "slash")}">توثيق الحساب</a>
          </div>
               `
     }

     transporter.sendMail(mailOptions, (error, info) => {
         if (error) {
             console.log(error);
         }
     });
}

const sendResetMail = (email, otp) => {
     const transporter = nodemailer.createTransport(config);

     const mailOptions = {
         from: "moneywaracademy@gmail.com",
         to: email,
         subject: "اعادة تعيين كلمة المرور",
         text: "اعد تعيين كلمة مرور حسابك!",
         html: `
          <div style="background-color: #0F0E0E; padding:1rem; border-radius: 8px; color:#fff; flex-direction: column; justify-content: center; align-items: center;">
          <br>
          <h1 style"font-size: 1rem;
          margin-bottom: 1rem;">Money War Academy Account</h1>
          <br>
          <h3>التحقق من البريد الالكتروني</h3>
          <p> يجب أن تكون عملية إعادة تعيين كلمة المرور خاصة بك ولا ينبغي مشاركتها مع أي شخص آخر. قد يتم استغلال إعادة تعيين كلمة المرور من قبل الأشخاص الذين يسعون للوصول غير المصرح به إلى حسابك أو بياناتك الشخصية.
            <br>
          </p> 
          <br>
            <a style="padding: 0.67rem 1.3rem; text-decoration: none; font-size: 1.1rem; margin: 1rem; background: #006FF8; color: #fff; border-radius: 6px;" href="http://127.0.0.1:3000/reset-password/${email}/${otp.replace(/\//g, "slash")}">اعاة تعيين كلمة المرور</a>
          </div>
               `
     }
     
     transporter.sendMail(mailOptions, (error, info) => {
         if (error) {
             console.log(error);
         }
     });
}

module.exports = { sendMail, sendResetMail };
