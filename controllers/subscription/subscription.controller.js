const subscriptionDataAccess = require("../../dal/subscription/subscription.dal");
// const ExpressError = require("../../Errorgenerator/errorGenerator");
const moment = require("moment-timezone");
require("../../JsonWebToken/jwt");
const Sub = require("../../models/subscription/subscription.model")
const users = require("../../models/user.model")
const stripe = require("stripe")("sk_test_51KRYRcJrEVeMChFE3d3tCZnWYtFbGrk1t59uL8fTPEdrxqZOuQkPuQUd8ScGM7byky2VwbW5aFxNC6IAhv80LLr700lJeMZIiC")
const subHistory = require("../../models/subscription/subscription.history");
// const ExpressError = require("../../Errorgenerator/errorGenerator");

// payment
exports.stripePayment = async (req) => {
  const token = await subscriptionDataAccess.chargeCustomerThroughTokenID(req);
  // console.log(subscriptionDataAccess?.subId?.data)
  console.log(token)
  return token}
 
exports.payment = async (req) => {
  // if(req.body.pricePlan=="free"){
  // return await subscriptionDataAccess.storeData({pricePlan:req.body.pricePlan})};
try{
  const id = req.token_data._id;
  const customer = await subscriptionDataAccess.customers(req);
  req.body.customerId = customer.id
  console.log(customer)
  // const result = await subscriptionDataAccess.card(customer, req);
  // const subscription = await subscriptionDataAccess.toke(result, req);
  // console.log("tokennn",subscription)
  const sub = await subscriptionDataAccess.subscriptionData(req);
  const subData = await subscriptionDataAccess.subId(sub);
  console.log(new Date(sub.current_period_start), new Date(sub.current_period_end), 'sub');
  // console.log(moment(sub.current_period_start).format(),moment(current_period_end).format());
  subData.createTime = moment().format("YYYY-MM-DD");
  subData.isoDate = moment().format("YYYY-MM-DD") + "T00:00:00Z";
  subData.amount=sub.plan.amount;
  subData.userId=id;
  subData.subscription=true;
  subData.pricePlan=req.body.pricePlan;
  if (subData.amount===0){
    subData.subscriptionId = "624c12983ae6c37624ca6dea"
  }
  else{
    subData.subscriptionId = "624c139cba77196ea3aef18d"
  }
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
  const newSub = await subHistory.create(subData);
  
  // const planUpdation = await subHistory.find({userId :id});
  // console.log(planUpdation)
  // planUpdation.forEach((item,index)=>{
  //     if(item?.amount===0){
  //       item.subscriptionId ="624c12983ae6c37624ca6dea"
  //     }
  //     else{
  //       item.subscriptionId = "624c139cba77196ea3aef18d"
  //     }
  // })

// let dta = await  subHistory.find({userId : id});
  console.log(newSub,'sub dta')
  let id2 = req.token_data._id
  let usrdta = await users.findByIdAndUpdate(id2,{$set : {
    subscriptionData : newSub._id
  }},{new : true})
  console.log('updated user',usrdta);
  let user= await users.findById(id);
  console.log( user,id, 'final output')
  return {
    success : true,
    error : false,
    data : newSub
  }
}
catch(err){
  return {
    success : false,
    error : true,
    message : err.message
  }
}
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

exports.deleteAllSub = async(req)=>{
  return await subHistory.remove()
}

exports.addSubDetails = async(req,res)=>{
  try{
    const data = await new Sub({
      planName : 'month',
      planDescription : "This is a monthly plan",
      duration : "1 month",
      price : "17",
      priceId : "price_1Kl9BkJrEVeMChFE5aig9RyS",
      planId : "price_1Kl9BkJrEVeMChFE5aig9RyS"
   })

   const dta = await data.save();
   if (dta){
     return {
       success : true,
       error : false,
       message : "data has been saved",
       data : dta
     }
   }
  }
  catch(err){
    return {
      success : false,
      error : true,
      message: err.message
    }
  }
}
exports.getPlanDetails = async(req,res)=>{
  const freeId = "624c12983ae6c37624ca6dea"
  const monthId = "624c264285d370570674e0ed"

  try{
    const data1 = await Sub.findById(freeId)
    const data2 = await Sub.findById(monthId)
    console.log(data1)
    return ({
      success : true,
      error : false,
      data :[data1,data2]
    })
  }
  catch(err){
    return{
      success : false,
      error : true,
      message : err.message
    }
  }

}

// exports.cancelSubsPlan = async(req)=>{
//   try{
//   let subs= await subHistory.findOne({userId : req.token_data._id })
//   if (subs){
//     let subId = subs.subscription.subId;
//     if (subs.subscription.isActive){
//      const subscriptionDelete = await stripe.subscription.del(subs.subscription.subId);
//       if (subscriptionDelete.status ==="canceled"){
//         subs.subscription.subId = null;
//         subs.clientId = '';
//         subs.secretCode = '';
//         subs.stripeEmail = '';
//         subs.stripeConnceted =false ;
//         return subs.save().then(async(subbs)=>{
//           let SubscriptionHistory = await subscriptionHistoryModel.findOne({subId : subId})
//           SubscriptionHistory.isActive = false;
//           return SubscriptionHistory.save().then((result)=>{
//             return {
//               status : 200,
//               message : "Plan cancelled successfully",
//               success : true
//             }
//           })
//         }).catch((error)=>{
//              return error
//         })
//       }
//     }else{
//       return{
//         status : 400,
//         message : "Plan Already Cancelled",
//         success : true,
//         data : "",
//       }
//     }
//   }
// }
// catch(err){
//   return err.message;
// }}
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
  // const data = await Sub.find({userId : _id}) ;
  const data = await subHistory.find({userId : _id}).populate('userId') ;
  return {
    success : true,
    error : false,
    data : data
  } ;
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


exports.cancelSubsPlan = async(req,res)=>{
  try{
    const _id = req.body._id
    const subHist = await subHistory.findOne({_id:_id})
    if (subHist?.amount === 0){
      const deletedDta = await stripe.subscriptions.del(
        subHist.subId 
      );
      if (deletedDta){
        subHist.isActive = false
        subHist.isCancelled = true
      }
   }
   else{

     const deleted = await stripe.subscriptions.update(
       subHist.subId , {cancel_at_period_end: true}
     );
 
     if (deleted){
       if (subHist){
         subHist.isCancelled = true
         
       }
   }
      const savedData = await subHist.save();
      return {
        success : true,
        error : false,
        message : "Data has been deleted",
        data : savedData
      }
    }

  }
  catch(err){
    return {
      success : false,
      error : true,
      message : err.message
    }
  }
}

exports.findSubscription = async(req,res)=>{
  try{
    const data = await Sub.find();
    return data
  }
  catch(err){
    return err.message
  }
}
// {
// "fullName":"Singh Ankur",
// "email":"ankur@gmail.com",
// "password":"singhsta",
// "id_type":"NRIC",
// "id_number":"80075",
// "gender":"Male",
// "floorNumber":"22222",
// "unitNumber":"7817222",
// "streetName":"New address",
// "postalCode":1277232,
// "id_country":"Singapore",
// "dob":"14/11/1995",
// "citizenship":"Singapore"
// }