const express = require("express");
const { authenticateToken } = require("../JsonWebToken/jwt");
const router = express.Router();
const adminController = require ("../controllers/admin.controller")
 
router.post("/storeAdmin",adminController.createAdmin);
router.post("/adminLogin",adminController.adminLogin);
router.put("/forgotAdmin",adminController.forgotAdmin);
router.put("/resetAdminPassword",adminController.resetAdminPassword);
module.exports = router;