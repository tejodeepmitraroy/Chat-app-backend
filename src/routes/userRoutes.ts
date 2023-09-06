import { Router } from "express";

import { authentication } from "../middleware/authMiddleware";
import {
  forgetPassword,
  loginUser,
  registerUser,
  resetLink,
  searchUser,
} from "../controllers/userController";

const router = Router();

router.route("/").post(registerUser);
router.route("/").get(authentication, searchUser);
router.route("/login").post(loginUser);
// router.route("/userInfo").get(authentication, userInfo);
router.route("/forgetPassword").post(forgetPassword);
router.route("/resetLink").put(resetLink);

export default router;
