const nodemailer = require("nodemailer");

exports.generateEmailTransporter = () =>
  nodemailer.createTransport({
    host: "smtp.zohocloud.ca",
    secure: true,
    port: 465,
    auth: {
      user: "campusplug@zohomailcloud.ca", //Zoho email
      pass: "e0YRrNSeJZQd", //Zoho password
    },
  });
