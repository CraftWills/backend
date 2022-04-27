const mongoose = require ("mongoose")

const invitationSchema = new mongoose.Schema ({


    name : {
        type : String
    },
    email : {
        type : String
    },
    subscriptionPlan :{
        type :  mongoose.Schema.Types.ObjectId,
        ref : "subscription"
    }
   
},{ timestamps: true })

const Invitation = mongoose.model("invitation", invitationSchema)
module.exports = Invitation