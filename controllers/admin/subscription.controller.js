const moment = require("moment-timezone");
const subscription = require ("../../models/subscription/subscription.model")
const users =    require ("../../models/user.model");
const wills = require("../../models/Will/will.model");


exports.totalSubscribedUsers = async(req,res)=>{
    try{
        let totalMonthPlanSub = 0;
        let totalFreePlanSub = 0;
        let totalEarning = 0;
        console.log(data);
        const data =await subscription.find();
        data.forEach((item,index)=>{

            totalEarning+=item?.amount || 0
    
            if (item.pricePlan==="month"){
                totalMonthPlanSub+=1
            }
            if (item.pricePlan==="free"){
                totalFreePlanSub+=1
            }
            })
        res.json({
            totalMonthSub : totalMonthPlanSub,
            totalFreePlan : totalFreePlanSub,
            totalSub : totalMonthPlanSub+totalFreePlanSub,
            totalEarning : totalEarning,
            lifeTimeEarning : totalEarning,
            thisMonthEarning : 20,
            thisWeekEarning : 200          
        });
     }
    catch (err){
        res.json({
            error : err.message,
            success : false
        })
}}


exports.subscriptionHistory = async(req,res)=> {
    try{
        const data = await subscription.find();
        console.log(data)
        let datas=[]
        data.forEach((item,index)=>{
        if(item?.subscription===true){

            datas.push({
                name : item?.name,
                email : item?.stripeEmail,
                subscriptionPlan : item?.pricePlan,
                subscriptionDate : item?.subscriptionStartDate,
                expiryDate : item?.subscriptionEndDate,
                price : item?.amount,
                Status : "Active"
  
            })
        }
        else{
            datas.push({
                name : item?.name,
                email : item?.stripeEmail,
                subscriptionPlan : item?.pricePlan,
                subscriptionDate : item?.subscriptionStartDate,
                expiryDate : item?.subscriptionEndDate,
                price : item?.amount,
                Status : "Expired"
  
            })
        }
            
        })
        res.json({
            data : datas
        })

    }
    catch(err){
        res.json({
            error : err.message
        })
    }
}

exports.subscriptionPlan = async(req,res)=>{
    try{
        const data = await subscription.find();
        data.forEach((item,index)=>{
            if (item?.pricePlan ==="month")
            res.json({
                name : item?.name,
                email : item?.stripeEmail,
                subscriptionPlan : item?.pricePlan,
                subscriptionDate : item?.subscriptionStartDate,
                expiryDate : item?.subscriptionEndDate,
                SubscribedPlan : item?.pricePlan
                
            })
        })

    }
    catch(err){
        res.send(err.message)
    }
}

exports.allSubscribers = async(req,res)=>{
    try{
        const data = await subscription.find()
        data.forEach((item,index)=>{
            res.json({
                name : item?.name,
                email : item?.stripeEmail,
                subscriptionPlan : item?.pricePlan,
                subscriptionDate : item?.subscriptionStartDate,
                expiryDate : item?.subscriptionEndDate,
                SubscribedPlan : item?.pricePlan,
                Status : item?.subscription 
            })
        })
    }
    catch(err){
        res.json(err.message)
    }
}