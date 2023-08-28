import nodemailer from "nodemailer";

const sendEmail = (email: string, subject: string, text: string) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: process.env.USER,
    to: email,
    subject,
    html: text,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err, "Email not sent");
    } else {
      console.log("Email sent successfully", info.response);
    }
  });
};

export default sendEmail;
