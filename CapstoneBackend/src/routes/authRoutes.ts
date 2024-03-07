import express from "express";
import {
  forgotPassword,
  login,
  resetPassword,
  signup,
  signupAdmin,
} from "../controllers/authControlle";
import {
  emailExists,
  loginValidation,
  signUpValidation,
} from "../middlewares/userAuthMiddlewares";
const router = express.Router();

router.post("/login", loginValidation, login);
router.post("/signup", signUpValidation, signup);
router.post("/admin/signup", signUpValidation, signupAdmin);
router.post("/forgotpassword", emailExists, forgotPassword);
router.post("/resetpassword", resetPassword);

export const userAuthRouter = router;
