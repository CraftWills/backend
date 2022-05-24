const express = require("express");
const { authenticateToken } = require("../../JsonWebToken/jwt");
const router = express.Router();
const WillController = require("../../controllers/will/will.controller");
const subscriptionDal = require ("../../dal/subscription/subscription.dal");
const { createWillData } = require("../../utils/createWillData");


// router.post("/storeWill",authenticateToken ,async (req, res) => {
//   const result = await WillController.storeWill(req);
//   return res.send(result);
// });
router.post("/storeWill",authenticateToken , WillController.storeWill )

//currently ignorable
router.put("/updateWill/:id", authenticateToken, async (req, res) => {
  const result = await WillController.UpdateWillData(req);
  return res.json(result);
});

router.get("/getWillDetails",authenticateToken ,async (request, response) => {
  const result = await WillController.getWillDetails(request);
  return response.json(result);
});


router.get("/pastVersions",authenticateToken, WillController.pastVersions);

router.get("/getWill/:id",authenticateToken,WillController.getWill)
router.get("/getWillInfo",WillController.getWillInfo)

router.delete("/deleteWill",authenticateToken,WillController.deleteWills)
router.delete("/deleteWillById/:id",authenticateToken,WillController.deleteWillById)
// router.get("/generatePdf",authenticateToken,WillController.generatePdf)
router.get("/generatePdf/:id" , createWillData, async (request, response) => {
  try {
    const result = await WillController.generatePdf(request);
    response.status(200).send(result);
  } catch (error) {
    response.status(500).send('Something went wrong')
  }
});


module.exports  = router
