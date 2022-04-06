const express = require("express");
const { authenticateToken } = require("../JsonWebToken/jwt");
const router = express.Router();
const adminController = require ("../controllers/admin.controller")
const dashboardController = require ("../controllers/admin/dashboard.controller")
const userManagementController = require ("../controllers/admin/usermanagement.controller");
const subscriptionController = require("../controllers/admin/subscription.controller");
const promocodeController = require("../controllers/admin/promocodes.controller")
const { subscription } = require("../dal/subscription/subscription.dal");
const upload = require("../middleware/multer");

router.post("/storeAdmin",adminController.createAdmin);
router.post("/login",adminController.adminLogin);
router.put("/forgotAdmin",adminController.forgotAdmin);
router.put("/resetAdminPassword",adminController.resetAdminPassword);
// router.get("/allUsers",dashboardController.allUsers);
router.get("/getUsersMonthly",dashboardController.getUsersMonthly)
router.get("/allSubscriptionUsers", async (req, res) => {
    const result = await dashboardController.allSubscriptionUsers(req);
    return res.send(result);
});
router.get("/allUsers", async (req, res) => {
    const result = await dashboardController.allUsers(req);
    return res.send(result);
});

// router.get("/totalWillCreated",async(req,res)=>{
//     const result = await dashboardController.totalWillCreated(req);
//     return res.send(result);
// })
router.get("/quickStats",async(req,res)=>{
    const result = await dashboardController.quickStatistics(req);
    return res.send(result);
})


// router.get("/sortByUser",async(req,res)=>{
//     const result = await userManagementController.sortByAllUsers(req);
//     res.send(result);
// })
router.get("/sortByUser",userManagementController.sortByAllUsers);
router.get("/sortBySubscribers",userManagementController.sortBySubscribedUsers);
router.delete("/deleteUser/:id",userManagementController.deleteUser)
router.put("/blockUser",userManagementController.blockUser)
router.post("/filterUsers",userManagementController.filterUsers)
router.get("/updateAdmin", async(req,res)=>{
    const result = await adminController.updateAdmin(req);
    res.send(result);
})
router.get("/totalSubscribedUser",subscriptionController.totalSubscribedUsers)
router.get("/subscriptionHistory",subscriptionController.subscriptionHistory)
router.post("/createPromocode",promocodeController.createPromocode)
router.delete("/deletePromocode/:id",promocodeController.deletePromocode)
router.get("/getPromocode",promocodeController.getPromocode)
router.put("/upload",
  upload.single("attachments"),
  async (req, res) => {
    const result = await adminController.uploadImage(req);
    return res.send(result);
  }
);
router.get("/getProfilepic",async (request, response) => {
    const result = await adminController.getProfilepic(request);
    return response.json(result);
  });

module.exports = router;


