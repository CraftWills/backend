const bcrypt = require("bcrypt");
// const momen = require("moment-timezone");
require("dotenv").config();
// const ExpressError = require("../Errorgenerator/errorGenerator");
const { generateAccessToken } = require("../JsonWebToken/jwt");
const usersDataAccess= require("../dal/user.dal")
const {myFunction} = require ("../nodemailer/nodemailer")
const emailExixtance =require ("email-existence");

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
    email: req.body.email,
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
    profileImage : null
   };
   


  //  if (data.gender==="male" || data.gender==="Male"){
  //    data.profileImage = "/uploads/male.png"
  //  }
  //  if (data.gender==="female" || data.gender==="Female"){
  //    data.profileImage = "/uploads/female.png"
  //  }

  const storedUser = await usersDataAccess.storeUser(data);
  if (storedUser){
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

// exports.createUserByLink = async (req) => {
//   const { email, password, first_name, last_name } = req.body;
//   if (!password || !email || !first_name || !last_name) {
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
    email: req.body.email,
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
  return {
    error: false,
    success: true,
    message: "login user successfully",
    data: userData,
    token,
  };
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
  // console.log(body.gender)
  // const user = await usersDataAccess.findUser(_id)
  // if(user){
  //   let {profileImage} = user
  //   const stringToCheck = profileImage.split('/')[2];
  //   console.log(stringToCheck)
  //   if(stringToCheck === 'defaultImage' || stringToCheck === 'male' || stringToCheck === 'female'){
  //     if (body.gender==="male" || body.gender==="Male"){
  //       console.log('male');
  //       profileImage = "/uploads/male.png"
  //     }
  //     if (body.gender==="female" || body.gender==="Female"){
  //       console.log('female');
  //       profileImage = "/uploads/female.png"
  //     }
  //   }  
  //   updateData.profileImage = profileImage
  // }
  // console.log(updateData);


const update = await usersDataAccess.updateUser(updateData);
if (update){
  return {
    error: false,
    success: true,
    message: "updated user successfully",
    data: update,
  };
};}

// exports.updatePassword = async (req, res) => {
//   const _id = req.token_data._id;
//   const { password, newPassword } = req.body;
//   if (!password || !newPassword) {
//     throw new ExpressError(401, "plz enter the  password or newPassword");
//   }
//   const userData = await usersDataAccess.findUser({
//     _id: _id,
//   });
//   const match = bcrypt.compareSync(password, userData.password);
//   if (!match) {
//     return new ExpressError(403, "Your Old Password is Invalid");
//   }
//   const passwordd = bcrypt.hashSync(newPassword, 10);
//   const updateData = {
//     _id,
//     toUpdate: {
//       password: passwordd,
//     },
//   };
//   const updatePass = await usersDataAccess.updateUser(updateData);
//   return {
//     error: false,
//     sucess: true,
//     message: "updated password successfully",
//     data: updatePass,
//   };
// };

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
  const users = await usersDataAccess.findUser(req.token_data._id);
    
  console.log(users.profileImage)
  emailExixtance.check(users.email,function(err,res){
    console.log("res :"+res)
  })

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
    profileImage : users.profileImage
    }
    
  };
};


exports.getProfilepic = async (req, res) => {
  const users = await usersDataAccess.findUser(req.token_data._id);
  
  return { 
    profileImage : users.profileImage
}
  };

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return  ("Email is missing in the request.");
  }
  const userData = await usersDataAccess.findUserByUsername({
    email: req.body.email,
  });
  if (!userData) {
    return({success: false, message : "email does not exists"})
  }
  console.log(userData.email)
  const otpSend = {
    from: "as797007@gmail.com",
    to: userData.email,
    subject: "Your Password Reset Link",
    text: `https://craftwill-m2.vercel.app/resetpassword/${userData._id}`,
  };
  
  myFunction(otpSend);

return {
    error: false,
    success: true,
    message: "forgot password link has been sent successfully to this email",
    data: userData,
  };
};

exports.verifyEmail = async(req,res)=>{
  const {_id} = req.body;
  if (!_id){
    throw new ExpressError(401,"please enter the _id");
  }
  const updateData= {
    _id,
    toUpdate : {
      isVerified : true,
    }
  }
  const update  = await usersDataAccess.updateUser(updateData);
  return {
    error : false,
    success : true,
    message : "email is verified successfully",
    verify : update
  }
}
 
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

// exports.reminderTime = async (req, res) => {
//   const { dailyReminder, subject, text, timezone, reminderTime } = req.body;
//   if (!dailyReminder || !subject || !text || !timezone || !reminderTime) {
//     throw new ExpressError(401, "Bad request");
//   }
//   const _id = req.token_data._id;
//   const updateData = {
//     _id,
//     toUpdate: {
//       subject: req.body.subject,
//       dailyReminder: dailyReminder,
//       text: req.body.text,
//       timezone: req.body.timezone,
//       newDate: momen().tz(req.body.timezone).format("YYYY-MM-DD HH:mm:ss ZZ"),
//       endDate: momen().tz(req.body.timezone).format(`${req.body.reminderTime}`),
//       reminderTime: req.body.reminderTime,
//     },
//   };
//   const update = await usersDataAccess.updateUser(updateData);
//   return {
//     error: false,
//     sucess: true,
//     message: "updated reminderTime successfully",
//     data: update,
//   };
// };

// const loginU = async (email) => {
//   const data = await usersDataAccess.findUserByUsername({
//     email,
//   });
//   const token = generateAccessToken({ _id: data._id });
//   return {
//     error: false,
//     sucess: true,
//     message: "login google oauth successfully",
//     data: data,
//     token,
//   };
// };

// exports.success = async (req, res) => {
//   try {
//     const oauth = req.user;
//     const userData = await usersDataAccess.findUserByUsername({
//       email: oauth.email,
//     });
//     if (!userData) {
//       const data = {
//         profileImage: "uploads/1633780506772defaultImage.jpg",
//         isVerified: false,
//         first_name: oauth.given_name,
//         last_name: oauth.family_name,
//         email: oauth.email,
//       };
//       await usersDataAccess.storeUser(data);
//     }
//     return loginU(oauth.email);
//   } catch (err) {
//     return new ExpressError(500, err.message);
//   }
// };
 

