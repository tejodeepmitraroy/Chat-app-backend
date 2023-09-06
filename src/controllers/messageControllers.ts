import { Request, Response } from "express";
import Message from "../models/messageModel";
import User from "../models/userModel";
import Chat from "../models/chatModel";

export const sendMessage = async (req: Request, res: Response) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.status(400).json("Invalid data passed into request");
  }

  if (typeof chatId === "string" && typeof content === "string") {
    const newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };

    try {
      let message = await Message.create(newMessage);
      message = await message.populate("sender", "name pic");
      message = await message.populate("chat");

      let updatedMessage = await User.populate(message, {
        path: "chat.users",
        select: "name pic email",
      });

      await Chat.findByIdAndUpdate(req.body.chatId, {
        latestMessage: updatedMessage,
      });

      return res.json(updatedMessage);
    } catch (error:any) {
      return res.status(400).json(error.message);
      // throw new Error(error.message);
    }
  } else {
    return res.status(400).json({ error: "Please give only string value" });
  }
};

export const allMessages = async (req:Request, res:Response) => {
  try {
    const message = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    return res.json(message);
  } catch (error:any) {
    return res.status(400).json(error.message);
    // throw new Error(error.message);
  }
};
