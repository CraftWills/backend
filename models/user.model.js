// const { number, string } = require("joi");
const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  
  fullName : {
    type : String,
   },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  id_type: {
    type : String,
  },
  id_number : {
    type : String,
  },
  gender : {
    type : String,
  },
  floorNumber : {
    type : String,
  },
  unitNumber : {
    type : String,
  },
  streetName :{
    type : String,
  },
  postalCode : {
    type : Number,
  },
  id_country : {
    type : String,
    default : null
  },
  dob : {
    type : String,
    default : " "
  },
  Citizenship : {
    type : String,
    default : null
  },
  profileImage : {
    type : String,
    // default : "/uploads/defaultimage.png"
  },  
  memberPersonDetails : {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'MemberData'
  },
  subscriptionData:{
    type : mongoose.Schema.Types.ObjectId,
    ref : "subscriptionHistory"
  },
  isVerified : {
    type : Boolean
  },
  promoId : {
    type : mongoose.Schema.Types.ObjectId
  }
});

const User = mongoose.model("UserData", UserSchema);
module.exports = User;