// Subscribed Users
// All Users
// Quick stats
// Total Earnings  = Week/month/lifetime
const moment = require("moment-timezone");
const subscription = require ("../../models/subscription/subscription.model")

///--- to do-----


exports.getUsersMonthly = async (req,res)=> {
    try{
      let n =req.body.monthNumber;
      let m;
      let month= moment().tz("Asia/Kolkata").format("MM");
      let year = moment().tz("Asia/Kolkata").format("YYYY");
      m=n+1;
      // if (n >= month) {
      //       year--;
      // }
      const date = moment().format(`${year}-0${m}-01`);
    
      let changeMonth = moment().format(`${year}-0${n}-01`);
      // console.log(changeMonth)
      // console.log(date)
  
    const assetData = await AssetsDataAccess.findAssetsMonthly({
        fromDate: `${changeMonth}T00:00:00Z`,
        endDate: `${date}T00:00:00Z`, 
    })
    
    var total = 0
    assetData.forEach(function (item, index) {
      const Astdta= item.bankAccount.estimateValue;
      total+=Astdta
  });
  console.log("Total assets amount",total)
    res.json({
      message : "Assets total amount found successfully",
      success : true,
      amount : total
    })
    }
    catch (err) {
        res.json({
            success : false,
            message : "Something went wrong",
            error : err.message
        })
    }
    
  }
  
exports.allUsers =  async (req,res)=>{
    const users = await subscription.find();
    let datas= []
    users.forEach(function (item, index) {
        const data= {
            name : item.name,
            email : item.stripeEmail,
            subscriptionDate : item.subscriptionStartDate,
            expiryDate : item.subscriptionEndDate,
            lastLogin : item.updatedAt
        };
        datas.push(data)
     });
    res.send(datas);
}