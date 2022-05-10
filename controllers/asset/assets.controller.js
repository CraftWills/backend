const bcrypt = require("bcrypt");
// const momen = require("moment-timezone");
require("dotenv").config();
// const ExpressError = require("../Errorgenerator/errorGenerator");
const { generateAccessToken } = require("../../JsonWebToken/jwt");
const will = require("../../models/Will/will.model")
const asset = require("../../models/asset/assets.model")
const AssetsDataAccess = require("../../dal/asset/assets.dal")
const usersDataAccess = require("../../dal/user.dal")
const User = require("../../models/user.model")
const moment = require("moment-timezone")
const member = require("../../models/members.model")
const liabilities = require("../../models/liabilities/liabilities.model")
const liabilitiesDataAccess = require("../../dal/liabilities/liabilities.dal")
var _ = require('lodash');
//"-" is not defined
// ====================
// const liquid = ['bankAccount','investmentAccount','insurancePolicy','business','intellectualProperty']
// const iliquid = ['personalPossession','realEsate','motorVehicle','safeDepositBox']

// const AssetTypeFind = async(req,res)=>{
//   const liquid = ['bankAccount','investmentAccount','insurancePolicy','business','intellectualProperty']
//   const data = await asset.find();
//   if 
// }

const { myFunction } = require("../../nodemailer/nodemailer")

const storeAssets = async (req, res) => {
  const user = req.token_data._id
  const creatTime = moment().format("YYYY-MM-DD");
  // const creatTime ="2010-11-30";
  try {

    const Asset = new asset({
      user_id: user,
      country: req.body.country,
      specifyOwnershipType: req.body.specifyOwnershipType,
      estimateValue: req.body.estimateValue,
      type: req.body.type,
      isoDate: `${creatTime}`,
      bankAccount:
      {
        bankname: req.body.bankAccount?.bankname,
        accountNumber: req.body.bankAccount?.accountNumber,
      },
      business: {
        UEN_no: req.body.business?.UEN_no,
        businessName: req.body.business?.businessName
      },
      insurancePolicy: {
        policyName: req.body.insurancePolicy?.policyName,
        policyNumber: req.body.insurancePolicy?.policyNumber
      },
      intellectualProperty: {
        ip_Name: req.body.intellectualProperty?.ip_Name,
        ip_No: req.body.intellectualProperty?.ip_No
      },
      investmentAccount: {
        accountName: req.body.investmentAccount?.accountName,
        accountNo: req.body.investmentAccount?.accountNo
      },
      motorVehicle: {
        CarModel: req.body.motorVehicle?.CarModel,
        plateNo: req.body.motorVehicle?.plateNo
      },
      otherAssets: {
        asset_name: req.body.otherAssets?.asset_name,
        id_No: req.body.otherAssets?.id_No
      },
      personalPossession: {
        Name: req.body.personalPossession?.Name,
        id_No: req.body.personalPossession?.id_No
      },
      realEstate: {
        address: req.body.realEstate?.address,
      },
      safeDepositBox: {
        safe_Box_Location: req.body.safeDepositBox?.safe_Box_Location,
        safe_No: req.body.safeDepositBox?.safe_No
      }

    })
    if (Asset.type === "bankAccount" || Asset.type === "investmentAccount" || Asset.type === "insurancePolicy") {
      Asset.assetType = "liquid"
    }
    if (Asset.type === "personalPossession" || Asset.type === "realEstate" || Asset.type === "motorVehicle" || Asset.type === "safeDepositBox" || Asset.type === "business" || Asset.type === "intellectualProperty") {
      Asset.assetType = "iliquid"
    }

    const savedAsset = await Asset.save()
    res.json({
      success: true,
      status: 200,
      message: "Asset saved",
      data: savedAsset
    })
  }
  catch (err) {
    res.json({
      success: true,
      message: err.message,
      error: err.message
    })
    console.log(err)
  }
}

const getAssets = async (req, res) => {
  const _id = req.token_data._id
  try {
    const assetData = await asset.find({ user_id: _id })
    res.json({
      success: true,
      message: "Asset Data found successfully",
      data: assetData
    })
  }
  catch (err) {
    res.json({
      success: false,
      message: "Something went wrong",
      error: err
    })
  }
}


const updateAssets = async (req, res) => {
  const _id = req.params.id
  const updateData = {
    _id,
    toUpdate: {
      country: req.body.country,
      specifyOwnershipType: req.body.specifyOwnershipType,
      estimateValue: req.body.estimateValue,
      bankAccount:
      {
        bankname: req.body.bankAccount?.bankname,
        accountNumber: req.body.bankAccount?.accountNumber,
      },
      business: {
        businessName: req.body.business?.businessName,
        UEN_no: req.body.business?.UEN_no
      },
      insurancePolicy: {
        policyName: req.body.insurancePolicy?.policyName,
        policyNumber: req.body.insurancePolicy?.policyNumber
      },
      intellectualProperty: {
        ip_Name: req.body.intellectualProperty?.ip_Name,
        ip_No: req.body.intellectualProperty?.ip_No
      },
      investmentAccount: {
        accountName: req.body.investmentAccount?.accountName,
        accountNo: req.body.investmentAccount?.accountNo
      },
      motorVehicle: {
        CarModel: req.body.motorVehicle?.CarModel,
        plateNo: req.body.motorVehicle?.plateNo
      },
      otherAssets: {
        asset_name: req.body.otherAssets?.asset_name,
        id_No: req.body.otherAssets?.id_No
      },
      personalPossession: {
        Name: req.body.personalPossession?.Name,
        id_No: req.body.personalPossession?.id_No
      },
      realEstate: {
        address: req.body.realEstate?.address,
        safeDepositBox: {
        },
        safe_Box_Location: req.body.safeDepositBox?.safe_Box_Location,
        safe_No: req.body.safeDepositBox?.safe_No

      }
    },
  };

  try {
    const update = await AssetsDataAccess.updateAsset(updateData);
    if (update) {
      res.send({
        error: false,
        success: true,
        message: "Assets data updated successfully",
        data: update,
      });
    }
    else {
      res.send({
        error: true,
        message: "something went wrong",
        success: false
      });
    }
  } catch (err) {
    res.send({
      error: true,
      success: false,
      message: err.message
    })
  }
};


// const totalAssetsAmount = async(req,res)=>{
//     const aggCursor = await asset.aggregate([
//         {
//           $match: {
//             user_id: req.token_data._id
//           }
//         }, {
//           $group: {
//             _id: '$user_id', 
//             total: {
//               $sum : '$bankAccount.estimateValue'
//             }
//           }
//         }
//       ]);

// aggCursor.forEach(function (item, index) {
// console.log(item.total)
// res.json(item.total)   
// });
// }


// const totalNetWorth = async(req,res)=>{
//     const aggCursor1 = await asset.aggregate([
//         {
//           $match: {
//             user_id: req.token_data._id
//           }
//         }, {
//           $group: {
//             _id: '$user_id', 
//             total: {
//               $sum : '$bankAccount.estimateValue'
//             }
//           }
//         }
//       ])
//     const aggCursor2 = await liabilities.aggregate([
//         {
//           $match: {
//             user_id: req.token_data._id
//           }
//         }, {
//           $group: {
//             _id: '$user_id', 
//             total: {
//               $sum: '$privateDept.current_Outstanding_Amount'
//             }
//           }
//         }
//       ])

//      var a=0;
//      var b=0;
//      aggCursor1.forEach(function (item, index) {
//          const agg1= item.total;
//          a+=agg1;
//      });
//      aggCursor2.forEach(function(item,index){
//          const agg2 = item.total;
//          b+=agg2;
//      })  
//     res.json({
//         message : "Total net worth",
//         amount : b-a
//     })
//     console.log(b-a)    
// }

const Statics = async (req, res) => {
  try {
    const FIRST_MONTH = 1
    const LAST_MONTH = 12
    var startOfToday = moment().format("YYYY-MM-DD");
    console.log("start of today", startOfToday)
    var startOfYear = moment().startOf('year').format("YYYY-MM-DD");
    console.log("start of year" + startOfYear)
    // let startOfToday = new Date(now., now.getMonth(), now.getDate());
    let YEAR_BEFORE = moment().subtract(1, 'year').format("YYYY-MM-DD");
    console.log(YEAR_BEFORE)
    let _id = req.token_data._id

    console.log("userId is ==", _id)
    // req.body.fromDate
    // req.body.endDate
    const monthsArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    // /////////////////////////

    let data = await asset.aggregate([{
      $match: {
        user_id: _id,
        isoDate: {
          $gte: startOfYear,
          $lte: startOfToday
        }
      }
    },
    {
      $group: {
        _id: { "year_month": { $substrCP: ["$isoDate", 0, 7] } },
        count: { $sum: 1 },
        total: {
          $sum: "$bankAccount.estimateValue"
        }
      }

    },

    {
      $sort: { "_id.year_month": 1 }
    },
    {
      $project: {
        _id: 0,
        count: 1,
        total: 1,
        month_year: {
          $concat: [
            { $arrayElemAt: [monthsArray, { $subtract: [{ $toInt: { $substrCP: ["$_id.year_month", 5, 2] } }, 1] }] },
            "-",
            { $substrCP: ["$_id.year_month", 0, 4] }
          ]
        }
      }
    },
    {
      $group: {
        _id: null,
        data: { $push: { k: "$month_year", v: "$total", count: "$count" } },
      }
    },
    {
      $addFields: {
        start_year: { $substrCP: [YEAR_BEFORE, 0, 4] },
        end_year: { $substrCP: [startOfToday, 0, 4] },
        months1: { $range: [{ $toInt: { $substrCP: [YEAR_BEFORE, 5, 2] } }, { $add: [LAST_MONTH, 1] }] },
        months2: { $range: [FIRST_MONTH, { $add: [{ $toInt: { $substrCP: [startOfToday, 5, 2] } }, 1] }] }
      }
    },

    {
      $addFields: {
        template_data: {
          $concatArrays: [
            {
              $map: {
                input: "$months1", as: "m1",
                in: {
                  count: 0,
                  month_year: {
                    $concat: [{ $arrayElemAt: [monthsArray, { $subtract: ["$$m1", 1] }] }, "-", "$start_year"]
                  }
                }
              }
            },
            {
              $map: {
                input: "$months2", as: "m2",
                in: {
                  count: 0,
                  month_year: {
                    $concat: [{ $arrayElemAt: [monthsArray, { $subtract: ["$$m2", 1] }] }, "-", "$end_year"]
                  }
                }
              }
            }
          ]
        }
      }
    },
    {
      $addFields: {
        data: {
          $map: {
            input: "$template_data", as: "t",
            in: {
              k: "$$t.month_year",
              v: {
                $reduce: {
                  input: "$data", initialValue: 0,
                  in: {
                    $cond: [
                      { $eq: ["$$t.month_year", "$$this.k"] },
                      { $add: ["$$this.v", "$$value"] },
                      { $add: [0, "$$value"] },
                    ]
                  }
                },
              },
            }
          }
        },
        dataTwo: "$data"
      }
    },
    ]);
    console.log("data hai   ", data)
    // console.log("Dataaa", JSON.stringify(data))

    let first = data[0]?.data?.map((item) => ({ ...item, count: 0 }));
    let second = first?.map((item) => ({ ...item, count: data[0]?.dataTwo?.find(el => el?.k === item?.k)?.count || 0 }))
    console.log("sahi h", second)



    let arr3 = data[0]?.data?.map((item, i) => Object.assign({}, item, data[0]?.dataTwo[i]));


    // const groupedByMonth = _.groupBy(merged, 'k');

    // console.log('Data', merged)


    let data2 = await liabilities.aggregate([{
      $match: {
        "user_id": req.token_data._id,
        isoDate: {
          $gte: '2021-01-01',
          $lt: '2022-10-10'
        }
      }
    },
    {
      $group: {
        _id: { "year_month": { $substrCP: ["$isoDate", 0, 7] } },
        count: { $sum: 1 },
        total: {
          $sum: "$current_Outstanding_Amount"
        }
      }

    },
    {
      $sort: { "_id.year_month": 1 }
    },
    {
      $project: {
        _id: 0,
        count: 1,
        total: 1,
        month_year: {
          $concat: [
            { $arrayElemAt: [monthsArray, { $subtract: [{ $toInt: { $substrCP: ["$_id.year_month", 5, 2] } }, 1] }] },
            "-",
            { $substrCP: ["$_id.year_month", 0, 4] }
          ]
        }
      }
    },
    {
      $group: {
        _id: null,
        data2: { $push: { k: "$month_year", v: "$total", c: "$count" } }
      }
    },
    {
      $addFields: {
        start_year: { $substrCP: [YEAR_BEFORE, 0, 4] },
        end_year: { $substrCP: [startOfToday, 0, 4] },
        months1: { $range: [{ $toInt: { $substrCP: [YEAR_BEFORE, 5, 2] } }, { $add: [LAST_MONTH, 1] }] },
        months2: { $range: [FIRST_MONTH, { $add: [{ $toInt: { $substrCP: [startOfToday, 5, 2] } }, 1] }] }
      }
    },

    {
      $addFields: {
        template_data: {
          $concatArrays: [
            {
              $map: {
                input: "$months1", as: "m1",
                in: {
                  count: 0,
                  month_year: {
                    $concat: [{ $arrayElemAt: [monthsArray, { $subtract: ["$$m1", 1] }] }, "-", "$start_year"]
                  }
                }
              }
            },
            {
              $map: {
                input: "$months2", as: "m2",
                in: {
                  count: 0,
                  month_year: {
                    $concat: [{ $arrayElemAt: [monthsArray, { $subtract: ["$$m2", 1] }] }, "-", "$end_year"]
                  }
                }
              }
            }
          ]
        }
      }
    },
    {
      $addFields: {
        data2: {
          $map: {
            input: "$template_data", as: "t",
            in: {
              k: "$$t.month_year",
              v: {
                $reduce: {
                  input: "$data2", initialValue: 0,
                  in: {
                    $cond: [
                      { $eq: ["$$t.month_year", "$$this.k"] },
                      { $add: ["$$this.v", "$$value"] },
                      { $add: [0, "$$value"] },
                    ]
                  }
                },
              },
            }
          }
        },
        dataThree: "$data2"
      }
      // {
      //   $project: {
      //     data: { $arrayToObject: "$data2" },
      //     _id: 0
      //   }
    }
    ]);
    let First = data2[0]?.data2?.map((item1) => ({ ...item1, count: 0 }));
    let Second = First?.map((item1) => ({ ...item1, count: data2[0]?.dataThree?.find(el1 => el1?.k === item1?.k)?.c || 0 }))


    let finalResult;
    if (data.length > 0) {
      finalResult = data[0].data

    } else {
      finalResult = [];
    }

    let finalResult2;
    if (data2.length > 0) {
      finalResult2 = data2[0].data
    }
    else {
      finalResult2 = [];
    }
    res.json({
      status: 200,
      success: true,
      assets: second,
      liabilities: Second
    })

  } catch (error) {
    console.log(error)
    res.send(error.message);

  }
}

////
const filterAssets = async (req, res) => {
  const _id = req.token_data._id

  const data = await asset.find({ user_id: _id })
  const filters = {};
  if (req.body.type) {
    filters.type = req.body.type;
  }
  if (req.body.specifyOwnershipType) {
    filters.specifyOwnershipType = req.body.specifyOwnershipType;
  }
  if (req.body.isoDate) {
    filters.isoDate = req.body.isoDate;
  }
  if (req.body.country) {
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


const deleteAssets = async (req, res) => {
  try {
    const data = await asset.remove({})
    res.json({
      message: "Asset data has been deleted successfully",
      success: true,
      data: data
    })
  }
  catch (err) {
    res.json({
      message: "something went wrong",
      success: false,
      error: err.message
    })
  }
}

/// deleteAssetById

const deleteAssetById = async (req, res) => {
  try {
    const _id = req.params.id
    const deletedData = await asset.findByIdAndRemove({ _id });
    if (deletedData) {
      res.json({
        success: true,
        message: "Data has been removed successfully"
      })
    }
    else {
      res.json({
        success: false,
        message: "something went wrong"
      })
    }
  }
  catch (err) {
    res.send(err.message)
  }
}
/////

const countLiquidAndiliquid = async (req, res) => {
  var liquid = 0;
  var iliquid = 0;
  const _id = req.token_data._id;
  const data = await asset.find({ user_id: _id })
  data.forEach(function (item, index) {
    const data = item.assetType;
    if (data == "liquid") {
      liquid += 1
    }
    if (data == "iliquid") {
      iliquid += 1
    }
  })
  res.json({
    liquidCount: liquid,
    iliquidCount: iliquid
  })
}

const quickStats = async (req, res) => {

  try {
    const _id = req.token_data._id
    const aggCursor1 = await asset.aggregate([
      {
        $match: {
          user_id: _id,
        }
      }, {
        $group: {
          _id: '$user_id',
          total: {
            $sum: '$estimateValue'
          }
        }
      }
    ])
    const aggCursor2 = await liabilities.aggregate([
      {
        $match: {
          user_id: _id,
        }
      }, {
        $group: {
          _id: '$user_id',
          total: {
            $sum: '$current_Outstanding_Amount'
          }
        }
      }
    ])


    const aggcursor3 = await will.aggregate([
      {
        $match: {
          user_id: _id
        },
      },
      {
        $project: {
          trust: "$trust"
        }
      },
      {
        $unwind: {
          path: "$trust"
        }
      },
      {
        $unwind: {
          path: "$trust.assets"
        }
      }
    ])




    var a = 0;
    var b = 0;
    var c = 0;

    aggCursor1.forEach(function (item, index) {
      const agg1 = item.total;
      a += agg1;
    });
    aggCursor2.forEach(function (item, index) {
      const agg2 = item.total;
      b += agg2;
    })
    const totalAssets = await asset.aggregate([
      {
        $match: {
          user_id: _id
        }
      }, {
        $group: {
          _id: '$user_id',
          total: {
            $sum: '$estimateValue'
          }
        }
      }
    ]);
    var totalAst = 0
    totalAssets.forEach(function (item, index) {

      totalAst += item.total
    });
    let N = aggcursor3.map(el => el?.trust?.assets?.estimatedValueOfShare)
    N.forEach((el) => {
      c += el
    })
    res.json({
      totalNetWorth: {
        amount: b - a
      },
      totalAssets: {
        amount: totalAst
      },
      totalLiabilities: {
        amount: b
      },
      totalAssetsInTrust: {
        amount: c
      }

    })
  }
  catch (err) {
    return err.message
  }
}


const averageDistributionRate = async (req, res) => {

  try {
    const _id = req.token_data._id
    const assets = await will.aggregate([
      {
        $match: {
          "user_id": _id
        }
      },
      {
        $unwind: {
          path: '$assets'
        }
      },
      {
        $unwind: {
          path: '$assets.membersData'
        }
      },
      {
        $lookup: {
          from: "members",
          localField: "assets.membersData.member",
          foreignField: "_id",
          as: "memberData"
        }
      },
      {
        $project: {
          assets: 1,
          memberData: 1
        }
      },
      {
        $unwind: {
          path: "$memberData"
        }
      },
      {
        $project: {
          memberName: "$memberData.memberAsPerson.fullname",
          member: "$assets.membersData.member",
          asset: "$assets.assetData",
          share: "$assets.membersData.specify_Shares"
        }
      }
    ])
    //  console.log(assetsTwo)
    const assetIds = assets.map(asset => asset.asset);
    let totalAssets = [...new Set(assetIds)].length;
    console.log("TotalAssets : ", totalAssets)
    let grouped = _.groupBy(assets, 'member');
    grouped = Object.keys(grouped).map(member => {
      console.log(member, grouped[member]);
      return {
        member: member,
        memberName: assets.find(asset => asset?.member == member)?.memberName,
        assetCount: grouped[member].length
      }
    })

    grouped = grouped.map(member => {
      return {
        ...member,
        share: Number(((member?.assetCount / totalAssets) * 100).toFixed(2))
      }
    })
    res.json({
      success: true,
      error: false,
      data: grouped
    })

  }

  catch (err) {
    res.json({
      success: false,
      error: true,
      message: err.message
    })
  }
}


module.exports = { storeAssets, updateAssets, getAssets, filterAssets, deleteAssets, countLiquidAndiliquid, quickStats, Statics, averageDistributionRate, deleteAssetById }
