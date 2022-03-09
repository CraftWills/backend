const express = require("express");
// const passport = require("passport");
const upload = require("../middleware/multer");
const { authenticateToken } = require("../JsonWebToken/jwt");
const router = express.Router();
const userController = require("../controllers/user.controller");
// const sub=require('../../src/dal/subscription/subscription.dal')
// const session = require ("express-session")

router.post("/signup", async (req, res) => {
  const result = await userController.createUser(req);
  return res.send(result);
});

// router.post("/invite/signup", async (req, res) => {
//   const result = await userController.createUserByLink(req);
//   return res.send(result);
// });

router.get("/getUser",authenticateToken,async (request, response) => {
  const result = await userController.getUser(request);
  return response.json(result);
});

router.get("/getProfilepic",authenticateToken ,async (request, response) => {
  const result = await userController.getProfilepic(request);
  return response.json(result);
});


router.post("/login", async (req, res) => {
  const result = await userController.loginUser(req);
  return res.send(result);
});
router.post("/adminLogin", async (req, res) => {
  const result = await userController.adminLogin(req);
  return res.send(result);
});


router.put("/updateProfile", authenticateToken, async (req, res) => {
  const result = await userController.updateUser(req);
  return res.json(result);
});


router.put("/updatePassword", authenticateToken, async (req, res) => {
  const result = await userController.updatePassword(req);
  return res.send(result);
});


router.put("/upload",
  authenticateToken,
  upload.single("attachments"),
  async (req, res) => {
    const result = await userController.uploadImage(req);
    return res.send(result);
  }
);

router.put("/forgotPassword", async (req, res) => {
  const result = await userController.forgotPassword(req);
  return res.send(result);
});

// router.put("/emailVerified", async (req, res) => {
//   const result = await userController.verifyEmail(req);
//   return res.send(result); 
// });

router.put("/resetPassword", async (req, res) => {
  const result = await userController.resetPassword(req);
  return res.send(result);
});

router.put("/verifyEmail/:id",async (req,res)=>{
  const result = await userController.verifyEmail(req);
  return res.send(result);
}); 
// router.put("/reminder", authenticateToken, async (req, res) => {
//   const result = await userController.reminderTime(req);
//   return res.send(result);
// });

// router.get("/resetPassword/:_id", userController.getId);

// router.get("/getAll", async (req, res) => {
//   const result = await userController.getAllusers(req);
//   return res.send(result);
// });

// const isLoggedIn = (req, res, next) => {
//   if (req.user) {
//     next();
//   } else {
//     res.sendStatus(401);
//   }
// };

// router.get("/", (req, res) => {
//   return res.json({ message: "You are not logged in" });
// });

// router.get("/failed", (req, res) => {
//   return res.send("Failed");
// });

// router.get("/success", isLoggedIn, async (req, res) => {
//   const result = await userController.success(req, res);
//   res.send(result);
// });

// // router.get(
// //   "/loginWith/google",
// //   passport.authenticate("google", {
// //     scope: ["email", "profile"],
// //   })
// // );

// // router.get(
// //   "/google/callback",
// //   passport.authenticate("google", {
// //     failureRedirect: "/users/failed",
// //   }),
// //   function (req, res) {
// //     res.redirect("/users/success");
// //   }
// // );

module.exports = router;