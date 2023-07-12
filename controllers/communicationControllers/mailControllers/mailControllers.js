import express from "express";
import nodemailer from "nodemailer";
import validator from "email-validator";

const transporter = nodemailer.createTransport({
  port: 465, // true for 465, false for other ports
  service: "gmail",
  auth: {
    user: "eng.osama.odeh.work@gmail.com",
    pass: "osamad12345",
  },
  secure: true,
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendMail = async (req, res) => {
  const { recipient, subject, text } = req.body;
  if (validator.validate(recipient)) {
    console.log("Emai Ok");
  }
  const mailOptions = {
    from: '"OSAMA ODEH" <eng.osama.odeh.work@gmail.com>',
    to: recipient,
    subject: subject,
    text: text,
    html: "<b>Hey there! </b> <br> This is our first message sent with Nodemailer<br/>",
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent: " + info.response);
      res.send("Email sent successfully");
    }
  });
};
