const moment = require("moment-timezone");
const subscription = require ("../../models/subscription/subscription.model")
const users = require ("../../models/user.model");
const wills = require("../../models/Will/will.model");

exports.sortByAllUsers = async(req,res)=>{
    try{
        const data = await users.find({"fullName": "Ibrahim Adil"});
        console.log(data)
          
    }
    catch(err){
        return err.message
    }
}


