const mongoose = require("mongoose");
const AssetsSchema = new mongoose.Schema({

    user_id: {
        type: String
    },
    type : {
        type : String
    },
    assetType : {
        type : String
    },
    country: {
        type: String,
        default: "Singapore"
    },
    specifyOwnershipType: {
        type: String,
    },
    specifyShares : {
        type : String
    },
    isoDate:{
        type:String
    },
 
    bankAccount: {
     
        bankname: {
            type: String,     
        },
        accountNumber: {
            type: String,
            unique: true,
            sparse : true
        },
        estimateValue: {
            type: Number
        },
    },
    business : {
          businessName :{
            type : String
          },
          UEN_no : {
            type : String
          },
     
    },
    insurancePolicy : {
    
         policyName : {
            type : String
          },
          policyNumber: {
            type: String,
            unique: true,
            sparse : true
          },
    },
    intellectualProperty : {
 
        ip_Name : {
            type : String,
        },
        ip_No : {
            type : String
        },
    },
    investmentAccount : {

        accountName : {
            type : String,
          },
          accountNo: {
            type: String,
            unique: true,
            sparse : true
          },
 
    },
    motorVehicle : {
   
        CarModel : {
            type : String,
        },
        plateNo : {
            type : String,
        },
    
    },
    otherAssets : {
  
        asset_name: {
            type: String,
        },
    
        id_No : {
            type : String,
            unique : true,
            sparse : true
        },

    },
    personalPossession : {

        Name : {
            type : String,
        },
        id_No : {
            type : String
        }, 
    } ,
    realEstate : {
   
        address: {
            type: String,
        },
    },
    safeDepositBox : {
  
        safe_Box_Location: {
            type: String,
        },
        safe_No: {
            type: Number
           
        },    
    }
},{timestamps:true});

const Bank = mongoose.model("AssetsData", AssetsSchema);
module.exports = Bank;