import Chat from "../models/chatModel";
import User from "../models/userModel";
import { Request, Response } from "express";

//Access Chat or Create new Chat
export const accessChat = async (req: Request, res: Response) => {
  const { userId } = req.body;

  if (typeof userId === "string") {
    if (!userId) {
      return res
        .status(400)
        .json({ error: "UserId param not sent with request" });
    }

    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    let newIsChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    if (newIsChat.length > 0) {
      return res.send(newIsChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      try {
        const createdChat = await Chat.create(chatData);

        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          "users",
          "-password"
        );

        res.status(200).send(FullChat);
      } catch (error: any) {
        return res.status(400).json(error.message);
      }
    }
  }
};

//Fetch Chats
export const fetchChats = async (req: Request, res: Response) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results: any) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        return res.status(200).send(results);
      });
  } catch (error: any) {
    return res.status(400).json(error.message);
  }
};

// Create Group
export const createGroupChats = async (req: Request, res: Response) => {
  const { name, description, groupImage, users } = req.body;
  if (!users || !name) {
    return res.status(400).send({ message: "Please Fill all the fields" });
  }

  if (typeof name === "string") {
    // let users = JSON.parse(users);

    if (users.length < 1) {
      return res.status(400).send("1 users are required to form a group chat");
    }

    users.push(req.user);

    try {
      const groupChat = await Chat.create({
        chatName: name,
        description,
        groupImage,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user,
      });

      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

      return res.status(200).json(fullGroupChat);
    } catch (error: any) {
      return res.status(400).json(error.message);
      // throw new Error(error.message);
    }
  } else {
    return res.status(400).json({ error: "Please give only string value" });
  }
};

//Update Group Chat
export const updateGroupChat = async (req: Request, res: Response) => {
  const { chatId, name, description, groupImage, groupAdmin } = req.body;

  if (
    typeof chatId === "string" &&
    typeof name === "string" &&
    typeof description === "string" &&
    typeof groupImage === "string" &&
    typeof groupAdmin === "string"
  ) {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: name,
        description,
        groupImage,
        groupAdmin,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      return res.status(404).json("Chat Not Found");
      // throw new Error("Chat Not Found");
    } else {
      res.json(updatedChat);
    }
  } else {
    return res.status(400).json({ error: "Please give only string value" });
  }
};

//Add User in Group
export const groupAddUser = async (req: Request, res: Response) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    return res.status(400).json({ error: "Please Fill all the fields" });
  }

  if (typeof chatId === "string" && typeof userId === "string") {
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      return res.status(404).json("Chat Not Found");
      // throw new Error("Chat Not Found");
    } else {
      return res.json(added);
    }
  } else {
    return res.status(400).json({ error: "Please give only string value" });
  }
};

//Remove User in Group
export const groupRemoveUser = async (req: Request, res: Response) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    return res.status(400).json({ error: "Please Fill all the fields" });
  }

  if (typeof chatId === "string" && typeof userId === "string") {
  } else {
    return res.status(400).json({ error: "Please give only string value" });
  }
  const remove = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!remove) {
    return res.status(404).json("Chat Not Found");
    // throw new Error("Chat Not Found");
  } else {
    return res.json(remove);
  }
};
