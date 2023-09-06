import express from "express";
import { authentication } from "../middleware/authMiddleware";
import {
  updateGroupChat,
  accessChat,
  createGroupChats,
  fetchChats,
  groupAddUser,
  groupRemoveUser,
} from "../controllers/chatControllers";

const router = express.Router();

router
  .route("/")
  .post(authentication, accessChat)
  .get(authentication, fetchChats);
router.route("/group").post(authentication, createGroupChats);
router.route("/groupUpdate").put(authentication, updateGroupChat);
router.route("/groupAddUser").put(authentication, groupAddUser);
router.route("/groupRemoveUser").put(authentication, groupRemoveUser);

export default router;
