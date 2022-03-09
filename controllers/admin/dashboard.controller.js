// Subscribed Users
// All Users
// Quick stats
// Total Earnings  = Week/month/lifetime
const moment = require("moment-timezone");
const subscription = require ("../../models/subscription/subscription.model")
const users = require ("../../models/user.model");
const wills = require("../../models/Will/will.model");
///--- to do-----


exports.getUsersMonthly = async (req,res)=> {
    try{
      let n =req.body.monthNumber;
      let m;
      let month= moment().tz("Asia/Kolkata").format("MM");
      let year = moment().tz("Asia/Kolkata").format("YYYY");
      m=n+1;
      console.log("the calculation is :-",m)
      const date = moment().format(`${year}-0${m}-01`);
      let changeMonth = moment().format(`${year}-0${n}-01`);
      console.log(changeMonth);
      console.log(date);
     
    const userData = await subscription.find({
      $gte : `${changeMonth}`,
        $lt :  `${date}`, 
    })
    console.log(userData)

    }

    catch (err) {
        res.json({
            success : false,
            message : "Something went wrong",
            error : err.message
        })
    }
    
  }   
  
exports.allSubscriptionUsers =  async (req,res)=>{
try{
  const users = await subscription.find();
  console.log(users)
  return users.map(getUserDetails);
  
  function getUserDetails(item) {
    console.log([
      item.name,item.stripeEmail,item.subscriptionStartDate,item.subscriptionEndDate,item.updatedAt
    ])
    }
}catch(err){
  res.json({
    message : err.message
  })
}
}



exports.totalWillCreated = async(req,res)=>{
  
  try{
    var willCount = 0
    const willData = wills.find();
    willData.forEach((item,index)=>{
        willCount+=1
    })
    console.log(willCount);
  }catch(err){
    return {
      success : false,
      message : err.message
    }
  }
}