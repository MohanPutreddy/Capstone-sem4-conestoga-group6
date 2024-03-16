import express from "express";
import {
  adminLogin,
  editAccountStatus,
  forgotPassword,
  getAllUsers,
  getProfile,
  login,
  resetPassword,
  saveProfile,
  signup,
  signupAdmin,
} from "../controllers/authControlle";
import {
  emailExists,
  loginValidation,
  signUpValidation,
} from "../middlewares/userAuthMiddlewares";
import { isUserAdmin, tokenValidation } from "../middlewares/tokenValidation";
import multer from "multer";
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, "uploads");
  },
  filename: (req: any, file: any, cb: any) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post("/login", loginValidation, login);
router.post("/admin/login", loginValidation, adminLogin);
router.post("/signup", signUpValidation, signup);
router.post("/admin/signup", signUpValidation, signupAdmin);
router.post("/forgotpassword", emailExists, forgotPassword);
router.post("/resetpassword", resetPassword);
router.get("/profile", tokenValidation, getProfile);
router.post("/profile", upload.single("file"), tokenValidation, saveProfile);
router.post("/accountstatus", tokenValidation, isUserAdmin, editAccountStatus);
router.get("/admin/users/all", tokenValidation, isUserAdmin, getAllUsers);

export const userAuthRouter = router;
