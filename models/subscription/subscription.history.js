// const mongoose = require('mongoose');

// const Schema = mongoose.Schema;
// const {ObjectId} = Schema;
// const SubscriptionHistorySchema = new Schema({
//   userId: {
//     type: ObjectId,
//     ref: 'User'
//   },
//   subscriptionId: {
//     type: ObjectId
//   },
//   subId: {
//     type: String
//   },
//   planName: {
//     type: String
//   },
//   planPrice: {
//     type: Number
//   },
//   email: {
//     type: String
//   },
//   firstName: {
//     type: String
//   },
//   lastName: {
//     type: String
//   },
//   date: {
//     type: Date
//   },
//   expiryDate: {
//     type: Date
//   },
//   isActive: {
//     type: Boolean
//   },
//   invoice_pdf: {
//     type: String
//   }
// }, {
//   timestamps: true
// });
// module.exports = mongoose.model('SubscriptionHistory', SubscriptionHistorySchema);



const mongoose = require("mongoose");
const subscriptionHistorySchema = new mongoose.Schema({

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
  },
  isActive : {
    type : Boolean,
    default : true
  },
  isCancelled : {
    type : Boolean,
    default : false
  },
  Sub : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "subscription"
  }
},{
  timestamps : true
});

const SubscriptionHistory = mongoose.model("subscriptionHistory",subscriptionHistorySchema);
module.exports = SubscriptionHistory;