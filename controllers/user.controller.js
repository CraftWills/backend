const bcrypt = require("bcrypt");
// const momen = require("moment-timezone");
require("dotenv").config();
// const ExpressError = require("../Errorgenerator/errorGenerator");
const { generateAccessToken } = require("../JsonWebToken/jwt");
const usersDataAccess= require("../dal/user.dal")
const {myFunction} = require ("../nodemailer/nodemailer")
const emailExixtance =require ("email-existence");
const User = require ("../models/user.model");
const jwt = require ("jsonwebtoken")

/// Signup


exports.createUser = async (req) => {
  const { email, password, first_name, last_name,id_type,id_number,gender,floorNumber,unitNumber,streetName,postalCode} = req.body;
  if (!password || !email || !first_name || !last_name || !id_type || !id_number || !gender || !floorNumber || !unitNumber || !streetName || !postalCode) {
    // throw new ExpressError(401, "Bad request");
    console.log('err')
  }

  const passwordHash = bcrypt.hashSync(req.body.password, 10);

  const data = {
    fullName : req.body.fullName,
    email: req.body.email.toLowerCase(),
    id_type : req.body.id_type,
    id_number : req.body.id_number,
    password: passwordHash,
    gender : req.body.gender,
    floorNumber : req.body.floorNumber,
    unitNumber : req.body.unitNumber,
    streetName : req.body.streetName,
    postalCode : req.body.postalCode,
    citizenship : req.body.citizenship,
    dob : req.body.dob,
    profileImage : null,
    isVerified : false
   };
   
  const storedUser = await usersDataAccess.storeUser(data);
  if (storedUser){

  const HT = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="font-family:arial, 'helvetica neue', helvetica, sans-serif">
  <head>
  <meta charset="UTF-8">
  <meta content="width=device-width, initial-scale=1" name="viewport">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta content="telephone=no" name="format-detection">
  <title>New Template</title>
  <!--[if (mso 16)]>
  <style type="text/css">
  a {text-decoration: none;}
  </style>
  <![endif]-->
  <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
  <!--[if gte mso 9]>
  <xml>
  <o:OfficeDocumentSettings>
  <o:AllowPNG></o:AllowPNG>
  <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
  </xml>
  <![endif]-->
  <style type="text/css">
  #outlook a {
  padding:0;
  }
  .es-button {
  mso-style-priority:100!important;
  text-decoration:none!important;
  }
  a[x-apple-data-detectors] {
  color:inherit!important;
  text-decoration:none!important;
  font-size:inherit!important;
  font-family:inherit!important;
  font-weight:inherit!important;
  line-height:inherit!important;
  }
  .es-desk-hidden {
  display:none;
  float:left;
  overflow:hidden;
  width:0;
  max-height:0;
  line-height:0;
  mso-hide:all;
  }
  [data-ogsb] .es-button {
  border-width:0!important;
  padding:10px 20px 10px 20px!important;
  }
  .es-button-border:hover a.es-button, .es-button-border:hover button.es-button {
  background:#56d66b!important;
  border-color:#56d66b!important;
  }
  .es-button-border:hover {
  border-color:#42d159 #42d159 #42d159 #42d159!important;
  background:#56d66b!important;
  }
  @media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120% } h1 { font-size:30px!important; text-align:left } h2 { font-size:24px!important; text-align:left } h3 { font-size:20px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:30px!important; text-align:left } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:24px!important; text-align:left } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important; text-align:left } .es-menu td a { font-size:14px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:14px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:14px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:inline-block!important } a.es-button, button.es-button { font-size:18px!important; display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0!important } .es-m-p0r { padding-right:0!important } .es-m-p0l { padding-left:0!important } .es-m-p0t { padding-top:0!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-m-p5 { padding:5px!important } .es-m-p5t { padding-top:5px!important } .es-m-p5b { padding-bottom:5px!important } .es-m-p5r { padding-right:5px!important } .es-m-p5l { padding-left:5px!important } .es-m-p10 { padding:10px!important } .es-m-p10t { padding-top:10px!important } .es-m-p10b { padding-bottom:10px!important } .es-m-p10r { padding-right:10px!important } .es-m-p10l { padding-left:10px!important } .es-m-p15 { padding:15px!important } .es-m-p15t { padding-top:15px!important } .es-m-p15b { padding-bottom:15px!important } .es-m-p15r { padding-right:15px!important } .es-m-p15l { padding-left:15px!important } .es-m-p20 { padding:20px!important } .es-m-p20t { padding-top:20px!important } .es-m-p20r { padding-right:20px!important } .es-m-p20l { padding-left:20px!important } .es-m-p25 { padding:25px!important } .es-m-p25t { padding-top:25px!important } .es-m-p25b { padding-bottom:25px!important } .es-m-p25r { padding-right:25px!important } .es-m-p25l { padding-left:25px!important } .es-m-p30 { padding:30px!important } .es-m-p30t { padding-top:30px!important } .es-m-p30b { padding-bottom:30px!important } .es-m-p30r { padding-right:30px!important } .es-m-p30l { padding-left:30px!important } .es-m-p35 { padding:35px!important } .es-m-p35t { padding-top:35px!important } .es-m-p35b { padding-bottom:35px!important } .es-m-p35r { padding-right:35px!important } .es-m-p35l { padding-left:35px!important } .es-m-p40 { padding:40px!important } .es-m-p40t { padding-top:40px!important } .es-m-p40b { padding-bottom:40px!important } .es-m-p40r { padding-right:40px!important } .es-m-p40l { padding-left:40px!important } }
  </style>
  </head>
  <body style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
  <div class="es-wrapper-color" style="background-color:#F6F6F6">
  <!--[if gte mso 9]>
  <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
  <v:fill type="tile" color="#f6f6f6"></v:fill>
  </v:background>
  <![endif]-->
  <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top">
  <tr>
  <td valign="top" style="padding:0;Margin:0">
  <table class="es-header" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
  <tr>
  <td align="center" style="padding:0;Margin:0">
  <table class="es-header-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
  <tr>
  <td style="Margin:0;padding-top:15px;padding-bottom:15px;padding-left:20px;padding-right:20px;background-color:#efefef;background-position:left bottom" bgcolor="#efefef" align="left">
  <!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:180px" valign="top"><![endif]-->
  <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
  <tr>
  <td class="es-m-p0r es-m-p20b" valign="top" align="center" style="padding:0;Margin:0;width:180px">
  <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td align="center" style="padding:0;Margin:0;padding-bottom:5px;font-size:0px"><a target="_blank" href="https://craftwill-m2.vercel.app/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#2CB543;font-size:14px"><img src="https://craftwill-m2.vercel.app/assets/Image/Logo/Craftwills..png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" class="adapt-img" width="180"></a></td>
  </tr>
  </table></td>
  </tr>
  </table>
  <!--[if mso]></td><td style="width:20px"></td><td style="width:360px" valign="top"><![endif]-->
  <table cellspacing="0" cellpadding="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td align="left" style="padding:0;Margin:0;width:360px">
  <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td class="es-m-txt-c" align="right" style="padding:0;Margin:0;padding-top:10px;font-size:0px">
  <table class="es-table-not-adapt es-social" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td valign="top" align="center" style="padding:0;Margin:0;padding-right:5px"><img title="Facebook" src="https://kydsbx.stripocdn.email/content/assets/img/social-icons/circle-black/facebook-circle-black.png" alt="Fb" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></td>
  <td valign="top" align="center" style="padding:0;Margin:0;padding-right:5px"><img title="Twitter" src="https://kydsbx.stripocdn.email/content/assets/img/social-icons/circle-black/twitter-circle-black.png" alt="Tw" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></td>
  <td valign="top" align="center" style="padding:0;Margin:0;padding-right:5px"><img title="Instagram" src="https://kydsbx.stripocdn.email/content/assets/img/social-icons/circle-black/instagram-circle-black.png" alt="Inst" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></td>
  <td valign="top" align="center" style="padding:0;Margin:0"><img title="Youtube" src="https://kydsbx.stripocdn.email/content/assets/img/social-icons/circle-black/youtube-circle-black.png" alt="Yt" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  </table>
  <!--[if mso]></td></tr></table><![endif]--></td>
  </tr>
  </table></td>
  </tr>
  </table>
  <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
  <tr>
  <td align="center" style="padding:0;Margin:0">
  <table class="es-content-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
  <tr>
  <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px">
  <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
  <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td align="center" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#040303;font-size:14px"><h1>Your password Reset Link </h1><br> https://craftwill.vercel.app/verifyEmail/${storedUser._id} <br> <h3> The link will get expired after 10 minutes </h3>&nbsp;</p></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  </table>
  </div>
  </body>
  </html>`
  const otpSend = {
      from: "dev.craftwill@gmail.com",
      to: data.email,
      subject: "Your Password verify Link",
      text: `https://craftwill.vercel.app/verifyEmail/${storedUser._id}`,
      html : HT
  };
  if (otpSend){
    data.isVerified = true
  }

myFunction(otpSend);

return {
    error: false,
    success: true,
    message: "user created successfully",
    data: storedUser,
  }}
else{
    return{
      error : true,
      success : false ,
      message : "User already exists",
    }
  };    
}


//TO DO

/// Cors error in verify email


exports.verifyEmail = async (req)=>{
  try {
    const _id = req.body.id;
    let userdata = await User.findByIdAndUpdate(_id, {$set : {
      isVerified : true
    }},{new : true})
    console.log(userdata)
    const token = generateAccessToken({ _id: _id });
    if (userdata){
      return {
        success : true,
        error : false,
        data : userdata,
        token : token
      }
    }
  }
  catch(err){
    return {
      success : false,
      error : true,
      message : err.message
    }
}}
//  exports.createUserByLink = async (req) => {
  //   if (!password || !email || !first_name || !last_name) {
  //   const { email, password, first_name, last_name } = req.body;
//     throw new ExpressError(401, "Bad request");
//   }
//   const passwordHash = bcrypt.hashSync(req.body.password, 10);
//   const data = {
//       isVerified: false,
//     first_name: req.body.first_name,
//     last_name: req.body.last_name,
//     email: req.body.email,
//     password: passwordHash,
//   };
//   const storedUser = await usersDataAccess.storeUser(data);
//   const otpSend = {
//     from: process.env.email,
//     to: storedUser.email,
//     subject: "Sending email using node.js",
//     text: `http://localhost:3001/Resetpassword/${storedUser._id}`,
//   };
//   myFunction(otpSend);
//   return {
//     error: false,
//     sucess: true,
//     message: "user created successfully",
//     data: storedUser,
//   };
// };

// // Login

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return ('bad request')
    // return new ExpressError(
    //   401, 
    //   "Either username or password is missing in the request."
    // );
  }
  const userData = await usersDataAccess.findUserByUsername({
    email: req.body.email.toLowerCase(),
  });


  if (!userData) {
    return {
      message : "Email not found in the database",
      success : false
      }
    // new ExpressError(404, "email not found in the database.");
  }
  const match = bcrypt.compareSync(req.body.password, userData.password);
  if (!match) {
    return {
      message : "Wrong password",
      success : false
    };
    // new ExpressError(403, "Invalid password");
  }
  const token = generateAccessToken({ _id: userData._id });
  if (userData.isVerified===true){
  return {
    error: false,
    success: true,
    message: "login user successfully",
    data: userData,
    token,
  }}
  else{
    return {
      error: true,
      success: false,
      message: "User is not verified"
    
    }
  }
};



// // Update 

exports.updateUser = async (req, res) => {
  const  _id = req.token_data._id;
  // const body = JSON.parse(JSON.stringify(req.body));
  let updateData = {
    _id,
    toUpdate: {
      fullName : req.body.fullName,
      email: req.body.email,
      id_type : req.body.id_type,
      id_number : req.body.id_number,
      gender : req.body.gender,
      floorNumber : req.body.floorNumber,
      unitNumber : req.body.unitNumber,
      streetName : req.body.streetName,
      postalCode : req.body.postalCode,
      id_country : req.body.id_country,
      dob : req.body.dob,
      Citizenship : req.body.Citizenship,
      // profileImage : req.file.filename
    }, 
    
};



const update = await usersDataAccess.updateUser(updateData);
if (update){
  return {
    error: false,
    success: true,
    message: "updated user successfully",
    data: update,
  };
};}


////// image uploading

exports.uploadImage = async (req, res) => {
  const _id = req.token_data._id;

  let profileImage;
  if (!req.file) {
    profileImage = null;
  } else {
    profileImage = "uploads/" + req.file.filename;
  }

  const updateImage = {
    _id,
    toUpdate: {
      profileImage,
    },
  };
  const updatedProfile = await usersDataAccess.updateUser(updateImage);
  return {
    error: false,
    success: true,
    message: "Uploaded Image Sucessfully",
    data: updatedProfile,
  };
};


exports.getUser = async (req, res) => {
  try{
  const users = await User.findById(req.token_data._id).populate('subscriptionData');

  console.log(users.profileImage)
  emailExixtance.check(users.email,function(err,res){
    console.log("res :"+res)
  })
///
  return {
    error: false,
    success: true,
    message: "User Found Successfully",
    data: {
    fullName : users.fullName,
    email: users.email,
    id_type : users.id_type,
    id_number : users.id_number,
    id_country : users.id_country,
    gender : users.gender,
    floorNumber : users.floorNumber,
    unitNumber : users.unitNumber,
    streetName : users.streetName,
    postalCode : users.postalCode,
    Citizenship : users.Citizenship,
    dob : users.dob,
    profileImage : users.profileImage,
    subscriptionData : users.subscriptionData
    }
  };

}catch(err){
  return {
    status : false,
    error : true,
    success : false,
    message : err.message
  }
}
};

////
exports.getProfilepic = async (req, res) => {
  const users = await usersDataAccess.findUser(req.token_data._id);
  
  return { 
    profileImage : users.profileImage
}
  };

exports.forgotPassword = async (req, res) => {

  const { email } = req.body;
  // const token =  jwt.sign()
  if (!email) {
    return  ("Email is missing in the request.");
  }
  const userData = await usersDataAccess.findUserByUsername({
    email: req.body.email,
  });
  if (!userData) {
    return({success: false, message : "email does not exists"})
  }

  var HTML = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="font-family:arial, 'helvetica neue', helvetica, sans-serif">
  <head>
  <meta charset="UTF-8">
  <meta content="width=device-width, initial-scale=1" name="viewport">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta content="telephone=no" name="format-detection">
  <title>New Template</title>
  <!--[if (mso 16)]>
  <style type="text/css">
  a {text-decoration: none;}
  </style>
  <![endif]-->
  <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
  <!--[if gte mso 9]>
  <xml>
  <o:OfficeDocumentSettings>
  <o:AllowPNG></o:AllowPNG>
  <o:PixelsPerInch>96</o:PixelsPerInch>
  </o:OfficeDocumentSettings>
  </xml>
  <![endif]-->
  <style type="text/css">
  #outlook a {
  padding:0;
  }
  .es-button {
  mso-style-priority:100!important;
  text-decoration:none!important;
  }
  a[x-apple-data-detectors] {
  color:inherit!important;
  text-decoration:none!important;
  font-size:inherit!important;
  font-family:inherit!important;
  font-weight:inherit!important;
  line-height:inherit!important;
  }
  .es-desk-hidden {
  display:none;
  float:left;
  overflow:hidden;
  width:0;
  max-height:0;
  line-height:0;
  mso-hide:all;
  }
  [data-ogsb] .es-button {
  border-width:0!important;
  padding:10px 20px 10px 20px!important;
  }
  .es-button-border:hover a.es-button, .es-button-border:hover button.es-button {
  background:#56d66b!important;
  border-color:#56d66b!important;
  }
  .es-button-border:hover {
  border-color:#42d159 #42d159 #42d159 #42d159!important;
  background:#56d66b!important;
  }
  @media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120% } h1 { font-size:30px!important; text-align:left } h2 { font-size:24px!important; text-align:left } h3 { font-size:20px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:30px!important; text-align:left } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:24px!important; text-align:left } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important; text-align:left } .es-menu td a { font-size:14px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:14px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:14px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:inline-block!important } a.es-button, button.es-button { font-size:18px!important; display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0!important } .es-m-p0r { padding-right:0!important } .es-m-p0l { padding-left:0!important } .es-m-p0t { padding-top:0!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-m-p5 { padding:5px!important } .es-m-p5t { padding-top:5px!important } .es-m-p5b { padding-bottom:5px!important } .es-m-p5r { padding-right:5px!important } .es-m-p5l { padding-left:5px!important } .es-m-p10 { padding:10px!important } .es-m-p10t { padding-top:10px!important } .es-m-p10b { padding-bottom:10px!important } .es-m-p10r { padding-right:10px!important } .es-m-p10l { padding-left:10px!important } .es-m-p15 { padding:15px!important } .es-m-p15t { padding-top:15px!important } .es-m-p15b { padding-bottom:15px!important } .es-m-p15r { padding-right:15px!important } .es-m-p15l { padding-left:15px!important } .es-m-p20 { padding:20px!important } .es-m-p20t { padding-top:20px!important } .es-m-p20r { padding-right:20px!important } .es-m-p20l { padding-left:20px!important } .es-m-p25 { padding:25px!important } .es-m-p25t { padding-top:25px!important } .es-m-p25b { padding-bottom:25px!important } .es-m-p25r { padding-right:25px!important } .es-m-p25l { padding-left:25px!important } .es-m-p30 { padding:30px!important } .es-m-p30t { padding-top:30px!important } .es-m-p30b { padding-bottom:30px!important } .es-m-p30r { padding-right:30px!important } .es-m-p30l { padding-left:30px!important } .es-m-p35 { padding:35px!important } .es-m-p35t { padding-top:35px!important } .es-m-p35b { padding-bottom:35px!important } .es-m-p35r { padding-right:35px!important } .es-m-p35l { padding-left:35px!important } .es-m-p40 { padding:40px!important } .es-m-p40t { padding-top:40px!important } .es-m-p40b { padding-bottom:40px!important } .es-m-p40r { padding-right:40px!important } .es-m-p40l { padding-left:40px!important } }
  </style>
  </head>
  <body style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
  <div class="es-wrapper-color" style="background-color:#F6F6F6">
  <!--[if gte mso 9]>
  <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
  <v:fill type="tile" color="#f6f6f6"></v:fill>
  </v:background>
  <![endif]-->
  <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top">
  <tr>
  <td valign="top" style="padding:0;Margin:0">
  <table class="es-header" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
  <tr>
  <td align="center" style="padding:0;Margin:0">
  <table class="es-header-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
  <tr>
  <td style="Margin:0;padding-top:15px;padding-bottom:15px;padding-left:20px;padding-right:20px;background-color:#efefef;background-position:left bottom" bgcolor="#efefef" align="left">
  <!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:180px" valign="top"><![endif]-->
  <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
  <tr>
  <td class="es-m-p0r es-m-p20b" valign="top" align="center" style="padding:0;Margin:0;width:180px">
  <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td align="center" style="padding:0;Margin:0;padding-bottom:5px;font-size:0px"><a target="_blank" href="https://craftwill-m2.vercel.app/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#2CB543;font-size:14px"><img src="https://craftwill-m2.vercel.app/assets/Image/Logo/Craftwills..png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" class="adapt-img" width="180"></a></td>
  </tr>
  </table></td>
  </tr>
  </table>
  <!--[if mso]></td><td style="width:20px"></td><td style="width:360px" valign="top"><![endif]-->
  <table cellspacing="0" cellpadding="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td align="left" style="padding:0;Margin:0;width:360px">
  <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td class="es-m-txt-c" align="right" style="padding:0;Margin:0;padding-top:10px;font-size:0px">
  <table class="es-table-not-adapt es-social" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td valign="top" align="center" style="padding:0;Margin:0;padding-right:5px"><img title="Facebook" src="https://kydsbx.stripocdn.email/content/assets/img/social-icons/circle-black/facebook-circle-black.png" alt="Fb" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></td>
  <td valign="top" align="center" style="padding:0;Margin:0;padding-right:5px"><img title="Twitter" src="https://kydsbx.stripocdn.email/content/assets/img/social-icons/circle-black/twitter-circle-black.png" alt="Tw" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></td>
  <td valign="top" align="center" style="padding:0;Margin:0;padding-right:5px"><img title="Instagram" src="https://kydsbx.stripocdn.email/content/assets/img/social-icons/circle-black/instagram-circle-black.png" alt="Inst" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></td>
  <td valign="top" align="center" style="padding:0;Margin:0"><img title="Youtube" src="https://kydsbx.stripocdn.email/content/assets/img/social-icons/circle-black/youtube-circle-black.png" alt="Yt" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  </table>
  <!--[if mso]></td></tr></table><![endif]--></td>
  </tr>
  </table></td>
  </tr>
  </table>
  <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
  <tr>
  <td align="center" style="padding:0;Margin:0">
  <table class="es-content-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
  <tr>
  <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px">
  <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
  <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  <tr>
  <td align="center" style="padding:0;Margin:0"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#040303;font-size:14px"><h1>Your password Reset Link </h1><br> https://craftwill-m3.vercel.app/resetpassword/${userData._id} <br> <h3> The link will get expired after 10 minutes </h3>&nbsp;</p></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  </table></td>
  </tr>
  </table>
  </div>
  </body>
  </html>`;

  console.log(userData.email)
  const otpSend = {
    from: "dev.craftwill@gmail.com",
    to: userData.email,
    subject: "Your Password Reset Link",
    text: `https://craftwill-m3.vercel.app/resetpassword/${userData._id}`,
    html :HTML,
    window : 1
  };
  
  myFunction(otpSend);

return {
    error: false,
    success: true,
    message: "forgot password link has been sent successfully to this email",
    data: userData,
  };
};
  
// exports.verifyEmail = async(req,res)=>{
//   const {_id} = req.body;
//   if (!_id){
//     throw new ExpressError(401,"please enter the _id");
//   }
//   const updateData= {
//     _id,
//     toUpdate : {
//       isVerified : true,
//     }
//   }
//   const update  = await usersDataAccess.updateUser(updateData);
//   return {
//     error : false,
//     success : true,
//     message : "email is verified successfully",
//     verify : update
//   }
// }
 
exports.resetPassword = async (req, res) => {
  const { _id, newPassword} = req.body;
  if (!_id || !newPassword ) {
    return ("plz enter the  _id or newPassword")
  }
  if (newPassword){
  const password = bcrypt.hashSync(newPassword, 10);
  const updateData = {
    _id,
    toUpdate: {
      password: password,
    },
}
  const updatePass = await usersDataAccess.updateUser(updateData);

  return {
    error: false,
    success: true,
    message: "reset password successfully",
    data: updatePass,
  };
};
};


exports.updatePassword = async (req, res) => {
  const _id = req.token_data._id;
  const { password, newPassword } = req.body;
  if (!password || !newPassword) {
    return "please enter password or new password"
  }
  const userData = await usersDataAccess.findUser({
    _id: _id,
  });
const match = bcrypt.compareSync(password, userData.password);
if (!match) {
    return {
      error : true,
      success : false,
      message : "your old password is invalid"
    }
  }
const passwordd = bcrypt.hashSync(newPassword, 10);
const updateData = {
    _id,
    toUpdate: {
      password: passwordd,
    },
  };
const updatePass = await usersDataAccess.updateUser(updateData);

return {
    error: false,
    success: true,
    message: "updated password successfully",
    data: updatePass,
  };
};


exports.getAllUsers = async(req,res)=>{
  try{
    const dta = await User.find().populate('Subscription')
    return dta
  }
  catch(err){
    return err.message
  }
}