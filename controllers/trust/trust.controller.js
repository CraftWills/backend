const bcrypt = require("bcrypt");
// const momen = require("moment-timezone");
require("dotenv").config();
// const ExpressError = require("../Errorgenerator/errorGenerator");
const { generateAccessToken } = require("../../JsonWebToken/jwt");
const TrustDataAccess= require("../../dal/trust.dal")
const trust = require("../../models/trust.model")
const usersDataAccess= require("../../dal/user.dal")
const User = require("../../models/user.model")
const moment = require ("moment-timezone")
const {myFunction} = require ("../../nodemailer/nodemailer")

exports.storeTrust = async (req,res) => {
  const user = req.token_data._id
  const creatTime = moment().format("YYYY-MM-DD");
    const {trustName,description} = req.body;
    if (!trustName|| !description) {
      // throw new ExpressError(401, "Bad request");
      console.log('err')
    }
    const data = {
        user_id : user,
        isoDate: `${creatTime}`,  
        trustName : req.body.trustName,
        description : req.body.description
    };
    
    const storedTrust = await TrustDataAccess.storeTrust(data);
    if (storedTrust){
    return {
      error: false,
      success: true,
      message: "Trust data stored successfully",
      data: storedTrust
    }}
    else{
      return{
        error : true,
        success : false ,
        message : "something went wrong",
      }
    };
}

// Getting Business Details


exports.getTrustDetails = async (req, res) => {
  const user = req.token_data._id
  const users = await TrustDataAccess.findTrust(user);
  
  return {
    error: false,
    success: true,
    message: "Trust data Found Successfully",
    data: {users}
  };
}



// Update Bank Details

exports.UpdateTrustData = async (req, res) => {
  const _id = req.params.id
  const updateData = {
    _id,
    toUpdate: {
        trustName : req.body.trustName,
        description : req.body.description
    },
  };
try {
const update = await TrustDataAccess.updateTrust(updateData);
if (update){
  return {
    error: false,
    success: true,
    message: "Trust data updated successfully",
    data: update,
  }
}
else {
return{
  message : "something went wrong",

}

}
} catch(err){
return{
  error : true,
  success : false,
  message : err.message
}
}
};


exports.filterTrust = async(req,res)=>{
  const _id = req.token_data._id
  const data = await trust.find({user_id : _id});
  const filters = {};
    if (req.body.type) {
      filters.type = req.body.type;
    }
    if (req.body.isoDate) {
      filters.isoDate = req.body.isoDate;
    }
    const filteredUsers = data.filter(user => {
      let isValid = true;
      for (key in filters) {
        console.log(key, user[key], filters[key]);
        isValid = isValid && user[key] == filters[key];
      }
      return isValid;
    });
    res.send(filteredUsers);

  }

exports.deleteTrusts = async (req,res)=> {
  try {
    const data = await trust.remove({});
    res.json({
      message : "data has been deleted",
      success : true,
      data : data
    })
  }
  catch (err){
    res.json({
      message : "something went wrong",
      success : false,
      error : err.message
    })
  }}

exports.deleteTrustById = async(req,res)=>{
  try{
    const _id = req.params.id
    const data = await trust.findByIdAndRemove({_id})
    if (data){
      res.send("Trust data has been deleted successfully")
    }
    else{
      res.send("Something went wrong")
    }
  } 
  catch(err){
    res.send(err.message)
  }
}