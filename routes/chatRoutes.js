import express from 'express'
import {
  getChats,
  createChat,
  deleteChat,
  saveChatMsgs,
  deleteChatMsgs,
} from '../controllers/chatsController.js'

const router = express.Router();

router
  .route("/")
  .get(getChats) // Chat messages included
  .post(createChat)
  .delete(deleteChat);

router.route("/messages").post(saveChatMsgs).delete(deleteChatMsgs);

export default router