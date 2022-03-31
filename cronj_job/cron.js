require("dotenv").config();
const cron = require("node-cron");
const moment = require("moment-timezone");
const stripe = require("stripe")(process.env.skTestKey);
const todayDate = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");
const Subscription = require("../models/subscription/subscription.model");
const subHistory = require("../models/subscription/subscription.history")
cron.schedule("20 0 * * *", async () => {
  const reports = await subHistory.find({ subscriptionEndDate: todayDate})
  if (reports) {
    console.log("Cronjob is Running")  
    const subscribe = await  stripe.subscriptions.del(reports[0].subId);
    const user = await subHistory.findOneAndUpdate(
      reports[0].subscriptionEndDate,
      { $set: { isActive: false } },
      { new: true }
      );
      
console.log(subscribe)
return subscribe  
}
});
