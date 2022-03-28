const express = require("express");
const { authenticateToken } = require("../../JsonWebToken/jwt");
const router = express.Router();
const liabilitiesController = require ("../../controllers/liabilities/liabilities.controller");

router.post ("/storeLiabilities", authenticateToken , liabilitiesController.storeLiabilities);
router.get("/getLiabilities",authenticateToken , liabilitiesController.getLiabilities);
router.get("/getStats",authenticateToken,liabilitiesController.liabilitystats);
router.post("/filterLiabilities",authenticateToken,liabilitiesController.liabilitiesFilter);
router.put("/UpdateLiabilities/:id",authenticateToken,liabilitiesController.updateLiabilities);
router.delete("/deleteLiabilities",authenticateToken,liabilitiesController.deleteLiabilities);
router.get("/getLiabilitiesMonthly",authenticateToken,liabilitiesController.getLiabilitiesMonthly);
router.delete("/deleteLiabilitiesById/:id",authenticateToken,liabilitiesController.deleteLiabilitiesById);


module.exports = router;