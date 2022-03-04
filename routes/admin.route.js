const express = require("express");
const { authenticateToken } = require("../JsonWebToken/jwt");
const router = express.Router();
const adminController = require ("../controllers/admin.controller")
const dashboardController = require ("../controllers/admin/dashboard.controller")
 
router.post("/storeAdmin",adminController.createAdmin);
router.post("/adminLogin",adminController.adminLogin);
router.put("/forgotAdmin",adminController.forgotAdmin);
router.put("/resetAdminPassword",adminController.resetAdminPassword);
router.get("/allUsers",dashboardController.allUsers);
module.exports = router;