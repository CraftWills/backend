const moment = require("moment-timezone");
const subscription = require ("../../models/subscription/subscription.model")
const users = require ("../../models/user.model");
const wills = require("../../models/Will/will.model");

exports.sortByAllUsers = async(req,res)=>{
    try{
        const data = await users.find().populate('Subscription');
        console.log(data)
        data.forEach((item,index)=>{
            // console.log ({name : item?.fullName,email:item?.email,item?.Subscription?.subscriptionStartDate,item?.Subscription?.subscriptionEndDate})            
        })             
    }
    catch(err){
        return err.message
    }
}


