const moment = require("moment-timezone");
const subscription = require ("../../models/subscription/subscription.model")
const users = require ("../../models/user.model");
const wills = require("../../models/Will/will.model");
const {ObjectId} = require("mongoose").Types;

exports.sortByAllUsers = async(req,res)=>{
    try{
        const data = await users.find().populate('Subscription');
        console.log(data)
        let datas=[]
        data.forEach((item,index)=>{
            datas.push ({name : item?.fullName,email:item?.email,subscriptionDate : item?.Subscription?.subscriptionStartDate,expiryDate : item?.Subscription?.subscriptionEndDate })            
        })             
    res.send(datas)}
    catch(err){
        res.json ({error:err.message,success : false})
    }
}

exports.sortBySubscribedUsers = async (req,res)=>{
    try{
      const data =await users.find().populate('Subscription');
      console.log(data)
      let datas=[]
      data.forEach((item,index)=>{
          if (item?.Subscription?.subscription === true){
              datas.push({name : item?.fullName,email:item?.email,subscriptionDate : item?.Subscription?.subscriptionStartDate,expiryDate : item?.Subscription?.subscriptionEndDate });
          }
      })
      res.send(datas)
    }
    catch(err){
        res.json({
            error : err.message,
            success : false
        })
    }
}


exports.deleteUser = async(req,res)=>{
    try {
        const id = req.params.id
        const data =await users.findByIdAndRemove(ObjectId(id));
        if (data){
            res.send( "data has been removed successfully");
        }
        else{
            res.send('something went wrong')
        }
    }
    catch(err){
        res.json({
            error: err.message,
            success : false
        })
    }
}

exports.blockUser =async(req,res)=>{
    try {
        const id = req.params.id
        const a = await users.find().populate("subscriptionData");
        console.log(a)
        const data =await users.findByIdAndUpdate(id,{$set : {
            isBlocked : true
        }});
        if (data){
            res.send( " User has been blocked successfully");
        }
        else{
            res.send('something went wrong')
        }
    }
    catch(err){
        res.json({
            error: err.message,
            success : false
        })
    }
}


exports.filterUsers = async(req,res)=>{
    const _id = req.body.id
  
    const data = await users.find({user_id : _id})
    const filters = {};
    if (req.body.type) {
      filters.type = req.body.type;
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
