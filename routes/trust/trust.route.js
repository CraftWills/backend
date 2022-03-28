const express = require("express");
const { authenticateToken } = require("../../JsonWebToken/jwt");
const router = express.Router();
const TrustController = require("../../controllers/trust/trust.controller");


router.post("/storeTrust",authenticateToken ,async (req, res) => {
  const result = await TrustController.storeTrust(req);
  return res.send(result);
});

//currently ignorable
router.put("/updateTrust/:id", authenticateToken, async (req, res) => {
  const result = await TrustController.UpdateTrustData(req);
  return res.json(result);
});

router.get("/getTrustDetails",authenticateToken ,async (request, response) => {
  const result = await TrustController.getTrustDetails(request);
  return response.json(result);
});

router.post("/filterTrust",authenticateToken,TrustController.filterTrust);
router.delete ("/deleteTrusts",authenticateToken,TrustController.deleteTrusts);
router.delete ("/deleteTrustById/:id",authenticateToken,TrustController.deleteTrusts);

module.exports = router
