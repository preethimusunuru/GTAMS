import nodemailer from "nodemailer";

export const sendEmail = async function (email, subject, message) {

  // console.log(process.env)
  const transportOptions = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_FROM_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  }

  const transporter = nodemailer.createTransport(transportOptions);

  // send mail with defined transport object
  await transporter.sendMail({
    from: {
      name: "GTAMS Support Team",
      address: process.env.SMTP_FROM_EMAIL
    }, // sender address
    to: email,      // user email,
    subject,        // Subject line
    html: message,  // html body
  });
};

// export default sendEmail;
