const liabilities = require ("../../models/liabilities/liabilities.model");
const mongoose = require ("mongoose")
const liabilitiesDataAccess = require("../../dal/liabilities/liabilities.dal")
const moment = require ("moment-timezone")

const storeLiabilities = async (req,res) => {
    const _id = req.token_data._id;
    const creatTime = moment().format("YYYY-MM-DD");
    console.log(req.body.securedLoan)
    try{
    const data = new liabilities ({
        user_id : _id,
        current_Outstanding_Amount : req.body?.current_Outstanding_Amount,
        type : req.body.type,
        isoDate: `${creatTime}`,
        privateDept: {
            dept_Name: req.body.privateDept?.dept_Name,
            description: req.body.privateDept?.description,
            lender: req.body.privateDept?.memberId
        },
        securedLoan: req.body?.securedLoan ? {
            loanName: req.body.securedLoan?.loanName,
            loanProvider: req.body.securedLoan?.loanProvider,
            loan_Number: req.body.securedLoan?.loan_Number,
            loan_Id_Number: req.body.securedLoan?.loan_Id_Number,
            description: req.body.securedLoan?.description,
            addAssets: req.body.securedLoan?.assetId,
        } : {},
        unsecuredLoan: {
            loanProvider: req.body.unsecuredLoan?.loanProvider,
            loan_Number: req.body.unsecuredLoan?.loan_Number,
            loan_Id_Number: req.body.unsecuredLoan?.loan_Id_Number,
            description: req.body.unsecuredLoan?.description,
        }
    })
    const savedData = await data.save();
    res.json({
        message : "Lialibilties data has been saved successfully",
        storedData : savedData,
        success : true
    })
    }
    catch (err) {
        res.json({
            message : err.message,
            error : true
        })
    }
}

const updateLiabilities = async (req, res) => {
  const _id = req.params.id
  const creatTime = moment().format("YYYY-MM-DD");
  const updateData = {
    _id,
    toUpdate: {
      current_Outstanding_Amount : req.body?.current_Outstanding_Amount,
      type : req.body.type,
      isoDate: `${creatTime}`,
      privateDept: {
          dept_Name: req.body.privateDept?.dept_Name,
          description: req.body.privateDept?.description,
          lender: req.body.privateDept?.memberId
      },
      securedLoan: req.body?.securedLoan ? {
          loanName: req.body.securedLoan?.loanName,
          loanProvider: req.body.securedLoan?.loanProvider,
          loan_Number: req.body.securedLoan?.loan_Number,
          loan_Id_Number: req.body.securedLoan?.loan_Id_Number,
          description: req.body.securedLoan?.description,
          addAssets: req.body.securedLoan?.assetId,
      } : {},
      unsecuredLoan: {
          loanProvider: req.body.unsecuredLoan?.loanProvider,
          loan_Number: req.body.unsecuredLoan?.loan_Number,
          loan_Id_Number: req.body.unsecuredLoan?.loan_Id_Number,
          description: req.body.unsecuredLoan?.description,
  
      }
    },
  };try{
const update = await liabilitiesDataAccess.updateLiabilities(updateData);
if (update){
   res.send({
    error: false,
    success: true,
    message: "Liabilities data updated successfully",
    data: update,
  });
}
else {
res.send({
  message : "Something Went wrong",
  success : false,
  error : true
})
}

}
catch(err) {
  res.send({
    message : err.message,
    success : false,
    error : true
  })
}
};


const getLiabilities = async (req,res) =>{
    const _id = req.token_data._id
    try {
        const data = await liabilities.find({user_id : _id});
        res.json({
            message : "data found successfully",
            success : true,
            data : data
        })
    }
    catch (err) {
        res.json({
            message : "data not found!",
            success : false,
            error : err.message
        })
    }
}
// var db = require('database-js');
const liabilitystats = async (req,res)=>{
    // const pipeline;
    const aggCursor = await liabilities.aggregate([
        {
          $match: {
            user_id: req.token_data._id
          }
        }, {
          $group: {
            _id: '$user_id', 
            total: {
              $sum: '$privateDept.current_Outstanding_Amount'
            }
          }
        }
      ]);

  aggCursor.forEach(function (item, index) {
        console.log(item.total)
        res.json(item.total)   
    });
};

const liabilitiesFilter = async(req,res)=>{
  const _id = req.token_data._id
    const data = await liabilities.find({user_id : _id})
    const filters = {};
  if (req.body.type) {
    filters.type = req.body.type;
  }
  if (req.body.isoDate) {
    filters.isoDate = req.body.isoDate;
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

// Get Liabilities monthly --

const getLiabilitiesMonthly = async (req,res)=>{
  try {
    let n =req.body.monthNumber;
    let m;
    let month= moment().tz("Asia/Kolkata").format("MM");
    let year = moment().tz("Asia/Kolkata").format("YYYY");
    m=n+1;
    const date = moment().format(`${year}-0${m}-01`);
    let changeMonth = moment().format(`${year}-0${n}-01`);
    
  const liabilitiesData = await liabilitiesDataAccess.findLiabilitiesMonthly({
    fromDate: `${changeMonth}T00:00:00Z`,
    endDate: `${date}T00:00:00Z`, 
  })
  console.log(liabilitiesData)
  var total=0
  liabilitiesData.forEach(function (item, index) {
    const liabdta= item.current_Outstanding_Amount;
    total+=liabdta
});
console.log(total)
  res.json({
    message: "Liabilities total amount found successfully between a month",
    success : true,
    amount : total
  })
}
  catch(err) {
    res.json({
      message : "something went wrong",
      success : false,
      error : err.message
    })
 
  }
}

const deleteLiabilities = async(req,res)=>{
  try {
    const data = await liabilities.remove({});
    res.json({
      message : "data has been removed",
      success : true,
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

const deleteLiabilitiesById = async (req,res)=>{
    try{
       const _id = req.params.id
       const data= await liabilities.findByIdAndRemove({_id})
       if (data){
         res.send("Liabilities data has been deleted")
       }
       else{
         res.send("something went wrong")
       }
    }
    catch(err){
      res.send(err.message)
    }
}
module.exports = {storeLiabilities , getLiabilities ,liabilitystats,liabilitiesFilter,updateLiabilities,deleteLiabilities,getLiabilitiesMonthly,deleteLiabilitiesById}