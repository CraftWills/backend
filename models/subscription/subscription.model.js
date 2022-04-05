const mongoose = require("mongoose");
const subscriptionSchema = new mongoose.Schema({
//   userId: {
//     type: String,
//   },
  userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserData'
    },
  address: {
    type: String,
  },
  pricePlan : {
    type: String,
  },

  upgrade: {
    type: Boolean,
    default:false
  },
  month: {
    type:String,
  },
  name: {
    type: String,
  },
  planName : {
      type : String
    },
    planDescription : {
      type : String
    },
    duration : {
      type : String
    },
    price : {
      type : String
    },
    priceId : {
      type : String
    },
    planId : {
      type : String
    },
  stripeEmail:{
    type:String
  },
  subId:{
    type:String
  },
  priceId:{
    type:String
  },
  createTime:{
    type:String
  },
  subscriptionEndDate:{
    type:String
  },
  subscriptionStartDate:{
    type:String
  },
  isoDate:{
    type:String
  },
  longestStreak:{
    type:String
  },
  currentStreak:{
    type:String
  },
  subscription:{
    type:Boolean,
    default : false
  },
  amount:{
    type:Number
  },
  features : {
    type : Array
  },
  customerToken : {
    type : String
  }
  ,isBlocked : {
    type : Boolean,
    default : false
  }
},{
  timestamps : true
});

const Subscription = mongoose.model("subscription", subscriptionSchema);
module.exports = Subscription;