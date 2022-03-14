const moment = require("moment-timezone");
const subscription = require ("../../models/subscription/subscription.model")
const users = require ("../../models/user.model");
const wills = require("../../models/Will/will.model");


exports.totalSubscribedUsers = async(req,res)=>{
    try{
        let total = 0;
        


    }
    catch (err){
        res.json({
            error : err.message,
            success : false
        })

    }
}