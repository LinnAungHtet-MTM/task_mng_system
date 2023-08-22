"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = require("nodemailer");
const sendEmail = (email, subject, text) => {
    const transporter = nodemailer_1.default.createTransport({
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
        text,
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err, "Email not sent");
        }
        else {
            console.log("Email sent successfully", info.response);
        }
    });
};
exports.default = sendEmail;
