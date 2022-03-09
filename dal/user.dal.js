const User = require("../models/user.model");
require("../JsonWebToken/jwt");

const findUser = async (data) => {
  const user = await User.findById(data);
  return user;
};

const storeUser = async (userToStore) => {
  try{
  console.log(userToStore)  
  const storedUser = await User.create(userToStore);
  return storedUser;
  }
  catch(err){
    console.log(err)
  }
};

const findUserByUsername = async (username) => {
  const user = await User.findOne(username);
  return user;
};

const updateUser = async (userData) => {
  const user = await User.findByIdAndUpdate(
    userData._id,
    { $set: userData.toUpdate },
    { new: true }
  );
  // await user.s ave()
  return user;
};

const findAll = async () => {
  const user = await User.find({});
  return user;
};

const deleteAll = async () => {
  const user = await User.remove({});
  return user;
};

module.exports = {
  findUser,
  storeUser,
  findUserByUsername,
  updateUser,
  findAll,
  deleteAll,
};