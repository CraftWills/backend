const Will = require("../../models/Will/will.model")
require("../../JsonWebToken/jwt");

// Find Will
const findWill = async (data) => {
  const user = await Will.find({user_id : data});
  return user;
};

const findPastVersions = async (data) => {
  const fetchdata = ["willName","DATE"]
  const user = await Will.find({user_id : data}).select(fetchdata);
  return user; 
};

// storeWill
const storeWill = async (willToStore) => {
  try{
  const storedWill = await Will.create(willToStore);
  return storedWill;
  }
  catch(err){
    console.log(err)
  }
};

//updateWill
const updateWill = async (userData) => {
  const user = await Will.findByIdAndUpdate(
    userData._id,
    { $set: userData.toUpdate },
    { new: true }
  );
  // await user.save()
  return user;
};


module.exports = {
    findWill,
    storeWill,
    updateWill,
    findPastVersions
};