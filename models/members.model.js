const mongoose = require ("mongoose")

const membersSchema = new mongoose.Schema ({

    user_id : {
        type : String
    },
    country : {
      type : String,
      default : "Singapore"
    },
    type : {
      type : String
    },
    isoDate : {
      type : String
    },
    isMember : {
      type : Boolean,
      default : true
    },
    memberAsPerson : {
        fullname : {
            type : String,  
          },
          Relationship: {
            type: String, 
          },
          id_number : {
            type : String
          },
          id_type : {
            type : String
          },
          gender : {
            type : String
          },
          floorNumber : {
            type : String
          },
          unitNumber : {
            type : String
          },
          streetName :{
            type : String
          },
          postalCode : {
            type : Number
          },
          dob : {
            type : String,
          },
          Citizenship : {
            type : String,
          },
    },
    memberAsOrganisation : {
        organisationName : {
            type : String
          },
          registration_number : {
            type : String,
          },
          floorNumber : {
            type : String
          },
          unitNumber: {
            type : String
          },
          streetName : {
            type : String
          },
          postalCode : {
            type : String
          }
    }
},{ timestamps: true })


const Members = mongoose.model("Members", membersSchema)
module.exports = Members