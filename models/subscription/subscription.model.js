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
  stripeData : {
    productId : {
      type : String,
      default : ''
    },
    priceId : {
      type : String,
      default : ''
    },
    planId : {
      type : String,
      default : ''
    }
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
    type:Boolean
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
},{
  timestamps : true
});

const Subscription = mongoose.model("subscription", subscriptionSchema);
module.exports = Subscription;