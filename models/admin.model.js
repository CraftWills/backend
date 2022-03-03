// const { number, string } = require("joi");
const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({

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