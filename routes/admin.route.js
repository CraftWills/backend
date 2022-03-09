const express = require("express");
const { authenticateToken } = require("../JsonWebToken/jwt");
const router = express.Router();
const adminController = require ("../controllers/admin.controller")
const dashboardController = require ("../controllers/admin/dashboard.controller")
 
router.post("/storeAdmin",adminController.createAdmin);
router.post("/adminLogin",adminController.adminLogin);
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

module.exports = router;
