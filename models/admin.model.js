// const { number, string } = require("joi");
const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({

    firstName: {
        type : String
    },
    lastName : {
        type : String
    },
    gender : {
        type : String
    },
    profilePic : {
        type : String
    },
    email : {
        type : String,
        unique : true
    },
    password : {
        type : String
    }
  
})


const Admin = mongoose.model("adminData", adminSchema);
module.exports = Admin;