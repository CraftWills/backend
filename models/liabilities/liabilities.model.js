const mongoose = require("mongoose")
const LiabilitiesSchema = mongoose.Schema({
    user_id: {
        type: String
    },
    current_Outstanding_Amount: {
        type: Number
    },
    type : {
        type : String
    },
    isoDate : {
        type : String
    },
    privateDept: {
        dept_Name: {
            type: String
        },
        
        description: {
            type: String
        },
        lender: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Members"
            }
        ],
    
    },
    securedLoan: {
        loanName: {
            type: String,
        }
        ,
        loanProvider: {
            type: String,
        },
        loan_Number: {
            type: String,
        },
        loan_Id_Number: {
            type: String,
        },
        description: {
            type: String
        },
        addAssets: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "AssetsData"
            }
        ],


    },
    unsecuredLoan: {
        loanProvider: {
            type: String,
        },
        loan_Number: {
            type: String,
        },
        loan_Id_Number: {
            type: String,
        },
        description: {
            type: String
        }

    }
},{ timestamps: true })

const Liability = mongoose.model("Liabilities", LiabilitiesSchema);
module.exports = Liability;