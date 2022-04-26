// Subscribed Users
// All Users
// Quick stats
// Total Earnings  = Week/month/lifetime
const moment = require("moment-timezone");
const subscription = require ("../../models/subscription/subscription.model")
const users = require ("../../models/user.model");
const wills = require("../../models/Will/will.model");
const subscriptionHistory = require ("../../models/subscription/subscription.history")

///--- to do--------
// exports.getUsersMonthly = async (req,res)=> {
//     try{
//       let n =req.body.monthNumber;
//       let m;
//       let month= moment().tz("Asia/Kolkata").format("MM");
//       let year = moment().tz("Asia/Kolkata").format("YYYY");
//       m=n+1;
//       console.log("the calculation is :-",m)
//       const date = moment().format(`${year}-0${m}-01`);
//       let changeMonth = moment().format(`${year}-0${n}-01`);
//       console.log(changeMonth);
//       console.log(date);
     
//     const userData = await subscription.find({
//       $gte : `${changeMonth}`,
//         $lt :  `${date}`, 
//     })
//     console.log(userData)

//     }

//     catch (err) {
//         res.json({
//             success : false,
//             message : "Something went wrong",
//             error : err.message
//         })
//     }
    
//   }   


/// dashboard graph

exports.getUsersMonthly = async(req,res)=>{
  try{
    const FIRST_MONTH = 1
    const LAST_MONTH = 12
    var startOfToday = moment().format("YYYY-MM-DD");
    console.log("start of today", startOfToday)
    var startOfYear = moment().startOf('year').format("YYYY-MM-DD");
    console.log("start of year" + startOfYear)
    // let startOfToday = new Date(now., now.getMonth(), now.getDate());
    let YEAR_BEFORE = moment().subtract(1, 'year').format("YYYY-MM-DD");
    console.log(YEAR_BEFORE)


    const monthsArray = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ]
    
    let data= await subscriptionHistory.aggregate([
      {
          $match: {
              "createTime": { $gte: "2022-04-10", $lt: "2022-04-26"}
          }
      },
         {
        $group: {
          _id: { "year_month": { $substrCP: ["$createTime", 0, 7] } },
          count: { $sum: 1 },
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
          data: { $push: { k: "$month_year", count: "$count" } },
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
      }
      ]);
      let first = data[0].data.map((item) => ({ ...item, count: 0 }));
      let second = first.map((item) => ({ ...item, count: data[0].dataTwo.find(el => el?.k === item?.k)?.count || 0 }))
      console.log(second)
   
      let finalResult ;
      if(data.length>0){
         finalResult=data[0].data

      }else{
         finalResult=[];
      }
      res.json( {
        status:200,
        success:true,
        data: second
      })
  }catch(error){
    console.log(error)
    res.send (error.message);
    
  }
}


exports.allSubscriptionUsers =  async (req,res)=>{
try{
  const users = await subscriptionHistory.find();
  console.log(users)
  return users.map(getUserDetails);
  
  function getUserDetails(item) {
    return({
      name :item.name,email:item?.stripeEmail,subDate:item.subscriptionStartDate, expDate : item.subscriptionEndDate,  price:item.amount,status:item.isActive,subPlan: item.pricePlan, userId : item.userId
    })
    }
}catch(err){
  res.json({
    message : err.message
  })
}
}



exports.quickStatistics = async(req,res)=>{
  
  try{
    var willCount = 0 
    var currentSubscribedUsers = 0
    const willData = await wills.find();
    const users = await subscription.find({subscription : true});
    willData.forEach((item,index)=>{
        willCount+=1
    })
    users.forEach((item,index)=>{
        currentSubscribedUsers+=1
    })

    return({
      success : true,
      error : false,
      totalWill : willCount,
      totalActiveWills : willCount,
      currentSubscribedUsers : currentSubscribedUsers
    })
  }catch(err){
    return {
      success : false,
      message : err.message
    }
  }
}

