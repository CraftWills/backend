const Subscription = require("../../models/subscription/subscription.model");
require("dotenv").config();
const stripe = require("stripe")(process.env.skTestKey);
const moment = require("moment-timezone");
const userModel = require("../../models/user.model");
const mongoose= require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const {myFunction} = require ("../../nodemailer/nodemailer")
const SubscriptionHistory = require("../../models/subscription/subscription.history")

const findb = async (data) => {
const subscription = await stripe.subscriptions.retrieve(
  'sub_1KVZCpJrEVeMChFEtF1Ye8V8'
);
console.log(subscription)
}
findb
const subscription = async (req, res, next) => {
  const reports = await Subscription.find({
    $and: [{ userId: req.token_data._id }, { subscription: true }]
  })
  if(reports){
    next()
  }else{
    res.send({message:"your validity has been expired"})
  }
}


const todayDate = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");
const storeData = async (subscriptionToStore) => {
  const data = await Subscription.create(subscriptionToStore);
  return data;
};

const storeDataToHistory = async (subscriptionToStore)=>{
  const data = await Subscription.create(subscriptionToStore);
  return data;
};

const findSub = async (data) => {
    
const reports = await Subscription.find();  
    return reports;
};


const customers = async (req) => {
  const createCustomer = await stripe.customers.create({
    email: req.body.stripeEmail,
    description: req.body.description,
    name: req.body.name,
    address: {
      line1: req.body.address,
      postal_code: req.body.zip,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
    },
  });
  return createCustomer;  
};  

const createCustomer = async data =>{
    return new Promise(async(resolve,reject)=>{
      try{
        await stripe.customers.create({
          source : data.cardDetails.cardToken,
          email : data.personalDetails.email,
          name : data.fullName
        }).then(async res =>{
              data.customerId = res.id;
              const result = await _stripeSubscribePlan.default.createSubscription(data);
          })
     }
      catch(err){
        console.log(err.message);
         return reject(err)
      }
    })
}

const card = async (customer, req) => {
  let param = {};
  param.card = {
    number: req.body.cardNumber,
    exp_month: req.body.expMonth,
    exp_year: req.body.expYear,
    cvc: req.body.cvc,
  };

// console.log(stripe.tokens.create(param))
  return {  
    token: await stripe.tokens.create(param),
    customerId: customer.id,
  };
};

const toke = async (result, req) => {
  const token = result["token"]["id"];
  const id = result.customerId;
  return await stripe.customers.createSource(id, {
    source: token,
  });
};


const subscriptionData = async (subscription, req) => {
  return await stripe.subscriptions.create({
    customer: subscription.customer,
    items: [
      {
        price: req.body.priceId,
      },
    ],
  });
};

const subId = async (sub) => {
  console.log(sub.current_period_start)
  console.log(sub.current_period_end)
  console.log(sub.latest_invoice)
  var data = {};
  data.priceId = sub.plan.id;
  data.subId = sub.id;
  data.periodStart = sub.current_period_start;
  data.periodEnd = sub.current_period_end;
  data.invoiceId = sub.latest_invoice;
  return data;
};

const createPlan = async (data) => {
  const plan = await stripe.plans.create({
    // amount: data.planPrice,
    amount: 20,
    currency: "usd",
    interval: "month",
    // interval_count: data.stripeDuration,
    product: data.productId,
  });
  data.stripePlanId = plan.id;
  return data;
};

const freePlan = async (req, res, next) => {
    console.log(req.token_data._id)
    if(req.body.pricePlan=="free"){
      const data=await Subscription.create({pricePlan:req.body.pricePlan})
    res.send (data)}
      else{
        next()
      }
  }


//// 01

const createProduct = async (req) => {
  const resp = await stripe.products.create({
    name: "monthly",
    description: "subscription monthly"
  });
  return resp;
};

const price = async (resp, req) => {
  const res = await stripe.prices.create({
    unit_amount: 20, //req.body.planPrice,
    currency: "usd",
    recurring: { interval: "month" },
    product: resp.id,
  });
  return res;
};

const creatp = async (res, resp, req) => {
  req.body.productId = resp.id;
  req.body.priceId = res.id;
  const result = await createPlan(req.body);
  return result;
};

const canclesub = async (req) => {
  const reports = await Subscription.find({
    $and: [{ userId: req.token_data._id }, { subscriptionEndDate: todayDate }]
  })
  if (reports) {
    console.log(reports)//sub_1KRytLJrEVeMChFEv2D8kcrj
    const subscribe = await  stripe.subscriptions.del(reports[0].subId);
    const user = await Subscription.findOneAndUpdate(
      reports[0].subscriptionEndDate,
      { $set: { subscription: false } },
      { new: true }
    );
    return subscribe
  }}

const Upgrade = async (req)=>{
  let planData = req.body;
  planData.userId = req.userId;
try {
  const subscription = await stripe.subscriptions.retrieve(req.body.subId);
  return stripe.subscriptions.update(req.body.subId, {
    items: [{
      id : subscription.items.data[0].id,
      price : req.body.priceId  
    }],
    proration_behavior: 'always_invoice'
  }).then(async (result) =>{
    let user = await userModel.findOne({_id : req.token_data._id})
    user.subscription = {
      subscriptionId : "",
      subId : req.body.subId,
      priceId : req.body.priceId,
      date : new Date(result.current_period_start*1000),
      expiryDate: new Date(result.current_period_end * 1000),
      isActive: true,
    }
    console.log(user)
    return user.save().then(async(resp)=>{
      if (resp){
        const otpSend = {
          from: "as797007@gmail.com",
          to: user.email,
          subject: "Mail from craftwills"
        };

        myFunction(otpSend);

      return {
        status :200,
        message : "subscribe successfully",
        success : true,
        data : resp
      }
    }
    }).catch ((err)=>{
      return err;
    })

    })
  
}
catch(err){
  console.log(err.message)
}
}

const chargeCustomerThroughTokenID = async function (req,res) {
  try{ var param = {
    amount:"1799",
    currency : 'usd',
    source: req.body.customerTOken
}
return await  stripe.charges.create(param)
}
catch(err){
  return err.message
}}
 

  /////////////////////////////////////////

//     const subscription = await stripe.subscriptions.retrieve('sub_1KRYyhJrEVeMChFEc5WAeQM2');
//     stripe.subscriptions.update('sub_1KRYyhJrEVeMChFEc5WAeQM2', {
//       cancel_at_period_end: false,
//       proration_behavior: 'create_prorations',
//       items: [{
//         id: subscription.items.data[0].id,
//         price: 'price_1KVYbEJrEVeMChFEp7OFka9D',
//       }]
//     });
//     // return subscription}

//     ////////
//    const user =  await Subscription.find({userId : req.token_data._id})
//    user.forEach(function (item, index) {
//     console.log(item)
// });


  // end  date m one month + krna h 
/////////////////////////////////////////////////////////////

// const canclesub = async (req) => {
//   const reports = await Subscription.find({ subscriptionEndDate: todayDate})
//   if (reports) {
//     console.log(reports)//sub_1KRytLJrEVeMChFEv2D8kcrj
//     const subscribe = await  stripe.subscriptions.del(reports[0].subId);
//     const user = await Subscription.findOneAndUpdate(
//       reports[0].subscriptionEndDate,
//       { $set: { subscription: false } },
//       { new: true }
//     );
//     return subscribe
//   }}
  



///////////////////////

const delPlan = async (req) => {
  const deleteData = await stripe.plans.del(req.body.priceId);
  return deleteData;
};

module.exports = {freePlan,
  storeData, findSub, customers, subscriptionData,
  toke, card, subId, creatp, price, createProduct, canclesub, delPlan,subscription, Upgrade,
  chargeCustomerThroughTokenID,createCustomer,storeDataToHistory
}