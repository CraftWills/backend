const nodeMailer = require("nodemailer");
require("dotenv").config();

const transPorter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: "dev.craftwill@gmail.com",
    pass: "qzfpglxigdzfnvfk",   
  },
});

exports.myFunction = (data) => {
  transPorter.sendMail(data, (err, info) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("email sent : " + info.response);
    }
  });
};

