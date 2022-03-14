const subscriptionDataAccess = require("../../dal/subscription/subscription.dal");
// const ExpressError = require("../../Errorgenerator/errorGenerator");
const moment = require("moment-timezone");
require("../../JsonWebToken/jwt");
const Sub = require("../../models/subscription/subscription.model")
const users = require("../../models/user.model")
const stripe = require("stripe")
const subHistory = require("../../models/subscription/subscription.history");
// const ExpressError = require("../../Errorgenerator/errorGenerator");

// payment
exports.stripePayment = async (req) => {
  const token = await subscriptionDataAccess.chargeCustomerThroughTokenID(req);
  console.log(token)
  return token}

exports.payment = async (req) => {
  // if(req.body.pricePlan=="free"){
  // return await subscriptionDataAccess.storeData({pricePlan:req.body.pricePlan})};

  const id = req.token_data._id;
  const customer = await subscriptionDataAccess.customers(req);
  console.log(customer)
  const result = await subscriptionDataAccess.card(customer, req);
  const subscription = await subscriptionDataAccess.toke(result, req);
  console.log("tokennn",subscription)
  const sub = await subscriptionDataAccess.subscriptionData(subscription, req);
  const subData = await subscriptionDataAccess.subId(sub);
  console.log(new Date(sub.current_period_start), new Date(sub.current_period_end), 'sub');
  // console.log(moment(sub.current_period_start).format(),moment(current_period_end).format());
  subData.createTime = moment().format("YYYY-MM-DD");
  subData.isoDate = moment().format("YYYY-MM-DD") + "T00:00:00Z";
  subData.amount=sub.plan.amount;
  subData.userId=id
  subData.subscription=true
  subData.pricePlan=req.body.pricePlan
  
    let months=parseInt(moment().format("MM"));
    months=months+1
    if (months < 10){
      months= "0" + months
    }

//   if(req.body.duration==="year"){
//   const year = parseInt(moment().tz("Asia/Kolkata").format("YYYY"))+1
//   subData.subscriptionStartDate= moment().tz("Asia/Kolkata").format("YYYY-MM-DD");
//   subData.subscriptionEndDate= moment().tz("Asia/Kolkata").format(`${year}-MM-DD`);
//   return await subscriptionDataAccess.storeData(subData);
// }else{

  subData.subscriptionStartDate= moment().format("YYYY-MM-DD");
  subData.subscriptionEndDate= moment().format(`YYYY-${months}-DD`);
  let newSub = await subHistory.create(subData);
  // let dta = await  subHistory.find({userId : id});
  // console.log(dta,'sub dta')
  let id2 = req.token_data._id
  let usrdta = await users.findByIdAndUpdate(id2,{$set : {
    Subscription : newSub._id
  }},{new : true})
  let user= await users.findById(id);
  console.log( user,id, 'final output')
  return newSub
  // return await subscriptionDataAccess.storeData(subData);
  
};
// };
  

exports.cancleSubscription = async (req) => {
  return await subscriptionDataAccess.canclesub(req);
};

exports.createProduct = async (req) => {
  const data1 = await subscriptionDataAccess.createProduct(req);
  const data2 = await subscriptionDataAccess.price(data1, req);
  const data3 = await subscriptionDataAccess.creatp(data2, data1, req);
  data3.userId=req.token_data._id
  return await subscriptionDataAccess.storeDataToHistory(data3)};

exports.upgradeSub = async(req) =>{
  return await subscriptionDataAccess.Upgrade(req);
}

// exports.getTotalAmountToday = async (req) => {
//   const createTime = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");//req.body.createTime;//"2021-10-23"
//   const sub = await subscriptionDataAccess.findSub({createTime:createTime});
//   for(i of sub){
  //   let totalAmount=0
//     if(i.amount!==undefined)
//     totalAmount=totalAmount+i.amount;
//   }
//   return {
//     error: false,
//     sucess: true,
//     message: "Get today total amount data",
//     data: sub,
//     totalAmount:totalAmount
//   };
// };

exports.deletePlan = async (req) => {
  return await subscriptionDataAccess.delPlan(req);
};

exports.getSubsDetails = async (req,res)=>{
  const  _id = req.token_data._id;
  const data = await Sub.find({userId : _id}) ;
  return data ;
}

exports.paymentIntent = async (req,res)=>{
  try{
 const paymentIntent = await stripe.paymentIntents.create({
   amount : 1999,
   currency : "usd"
 })  
 res.json({clientSecret : paymentIntent.clientSecret})
} catch (err){
  res.json({
    message : err.message
  })
}
}

