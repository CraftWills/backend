const members = require("../../models/members.model")
const membersDataAccess = require("../../dal/member/members.dal")
const moment = require ("moment-timezone")
const createMember = async (req, res) => {
    const _id = req.token_data._id
    const creatTime = moment().format("YYYY-MM-DD");
    try {
        const data = new members({
            user_id: _id,
            country: req.body?.country,
            type : req.body.type,
            isoDate: `${creatTime}`,
            memberAsPerson: {
                fullname: req.body.memberAsPerson?.fullname,
                Relationship: req.body.memberAsPerson?.Relationship,
                id_type: req.body.memberAsPerson?.id_type,
                id_number: req.body.memberAsPerson?.id_number,
                gender: req.body.memberAsPerson?.gender,
                floorNumber: req.body.memberAsPerson?.floorNumber,
                unitNumber: req.body.memberAsPerson?.unitNumber,
                streetName: req.body.memberAsPerson?.streetName,
                postalCode: req.body.memberAsPerson?.postalCode,
                citizenship: req.body.memberAsPerson?.citizenship,
                dob: req.body.memberAsPerson?.dob
                
            },
            memberAsOrganisation: {
                organisationName: req.body.memberAsOrganisation?.organisationName,
                registration_number: req.body.memberAsOrganisation?.registration_number,
                floorNumber: req.body.memberAsOrganisation?.floorNumber,
                unitNumber: req.body.memberAsOrganisation?.unitNumber,
                streetName: req.body.memberAsOrganisation?.streetName,
                postalCode: req.body.memberAsOrganisation?.postalCode,
            }
    })
        const savedData = await data.save()
        res.json({
            message: "Member data has been saved successfully",
            success: true,
            data: savedData
        })
    }
    catch (err) {
        res.json({
            message: "Something Went Wrong",
            success: false,
            error: err.message
        })
    }
}


const getMembers = async(req,res)=>{
    const _id = req.token_data._id
    try {
        const data = await members.find({user_id : _id});
        res.json({
            message : "Member data found successfully",
            success : true,
            data : data
        })
    }
    catch (err) {
        res.json({
            message : "something went wrong",
            success : false,
            error : err.message
        })
    }
}

const membersFilter = async(req,res)=>{
    const _id = req.token_data._id
    const data = await members.find({user_id : _id})
    const filters = {};
    if (req.body.type) {
      filters.type = req.body.type;
    }
    if (req.body.isoDate) {
      filters.isoDate = req.body.isoDate;
    }
    if (req.body.country){
      filters.country = req.body.country;
    }
    const filteredUsers = data.filter(user => {
      let isValid = true;
      for (key in filters) {
        console.log(key, user[key], filters[key]);
        isValid = isValid && user[key] == filters[key];
      }
      return isValid;
    });
    res.send(filteredUsers);
}

const updateMember = async (req, res) => {
    const _id = req.params.id
    const updateData = {
      _id,
      toUpdate: {
        country: req.body?.country,
        type : req.body.type,
        memberAsPerson: {
            fullname: req.body.memberAsPerson?.fullname,
            Relationship: req.body.memberAsPerson?.Relationship,
            id_type: req.body.memberAsPerson?.id_type,
            id_number: req.body.memberAsPerson?.id_number,
            gender: req.body.memberAsPerson?.gender,
            floorNumber: req.body.memberAsPerson?.floorNumber,
            unitNumber: req.body.memberAsPerson?.unitNumber,
            streetName: req.body.memberAsPerson?.streetName,
            postalCode: req.body.memberAsPerson?.postalCode,
            citizenship: req.body.memberAsPerson?.citizenship,
            dob: req.body.memberAsPerson?.dob
        },
        memberAsOrganisation: {
            organisationName: req.body.memberAsOrganisation?.organisationName,
            registration_number: req.body.memberAsOrganisation?.registration_number,
            floorNumber: req.body.memberAsOrganisation?.floorNumber,
            unitNumber: req.body.memberAsOrganisation?.unitNumber,
            streetName: req.body.memberAsOrganisation?.streetName,
            postalCode: req.body.memberAsOrganisation?.postalCode,
        }
      },
    };
try {
  const update = await membersDataAccess.updateMember(updateData);
  if (update){
    res.send({
      error: false,
      success: true,
      message: "Member data updated successfully",
      data: update,
    });
  }
  else {
  res.send({
      message :"Something went wrong",
      success : false
  }) 
  }
}catch(err){
    res.send({
        error : true,
        success : false,
        message : err.message
    })
}
  };

const deleteMembers = async (req,res)=>{
    try {
        const data = members.remove({})
        res.json({
            message : "Member data has been removed",
            success : false,
            data : data
        })
    }
    catch (err){
        res.json({
            message : "something went wrong",
            success : false,
            error : err.message
        })
    }
}

const deleteMemberById = async(req,res)=>{
    try{
    const _id = req.params.id
    const deletedData = await members.findByIdAndRemove({_id});
    if (deletedData){
        res.json({
            success : true,
            message : "Data has been removed successfully"
        })
    }
    else{
        res.json({
            success : false,
            message : "something went wrong"
        })
    }
    }
    catch(err){
        res.send(err.message)
    }

}

module.exports = {
    createMember,
    membersFilter,
    getMembers,
    updateMember,
    deleteMembers,
    deleteMemberById
}