const Assets = require("../../models/asset/assets.model");
require("../../JsonWebToken/jwt");

const findAsset = async (data) => {
  const user = await Assets.findById(data);
  return user;
};

const storeAsset = async (AssetsToStore) => {
  try{
  const storedAsset = await Assets.create(AssetsToStore);
  return storedAsset;
  }
  catch(err){
    console.log(err)
  }
};

// const findUserByUsername = async (username) => {
//   const user = await User.findOne(username);c
//   return user;
// };

const updateAsset = async (userData) => {
  const user = await Assets.findByIdAndUpdate(
    userData._id,
    { $set: userData.toUpdate },
    { new: true }
  );
  // await user.save()
  return user;
};

const findAssetsMonthly = async (data) => {
  const user = await Assets.find({isoDate: {$gte: data.fromDate, $lt: data.endDate},type : data.type});
  return user;
};

const deleteAll = async () => {
  const user = await Assets.remove({});
  return user;
};

module.exports = {
    findAsset,
    storeAsset,
    updateAsset,
    findAssetsMonthly,
    deleteAll
};