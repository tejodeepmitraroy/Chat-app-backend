import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  generateJwtToken,
  resetJwtToken,
  verifyJwtToken,
} from "../config/token/token";
import {
  passwordCompare,
  passwordHashed,
} from "../config/PasswordHasher/hasher";
import User from "../models/userModel";
import nodemailer from "nodemailer";

//Register User
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password, image } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please Enter all the Fields");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
      image,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        token: generateJwtToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Failed to create the User");
    }
  }
);

//Login User
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json("Please Enter all the Fields");
    // throw new Error();
  }

  if (typeof email === "string" && typeof password === "string") {
    const user = await User.findOne({ email });

    if (user && (await passwordCompare(password, user.password!))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        token: generateJwtToken(user._id),
      });
    } else {
      res.status(400).json("Invalid Email or Password");
      throw new Error("Invalid Email or Password");
    }
  } else {
    res.status(400);
    throw new Error("Please give only string value");
  }
});

// Search User   /api/user?search=tejo
export const searchUser = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query.search;

  if (typeof query !== "string" || query === "") {
    res.status(401);
    throw new Error("Please give only string value");
  }

  try {
    console.log(query);
    const users = await User.find({
      $or: [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ],
    }).find({ _id: { $ne: req.user._id } });

    res.send(users);
  } catch (error) {
    console.log(error);
  }
});

//Forget Password

export const forgetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ error: "Please Enter field" });
  }

  if (typeof email === "string") {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Email is not registered" });
    }
    const token = await resetJwtToken(user._id);

    console.log(token);
    try {
      //Connect SMPT
      const transporter = await nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: "tejodeepmitra@gmail.com",
          pass: "mnscfgbaxtsxcced",
        },
      });

      let info = await transporter.sendMail({
        to: email,
        subject: "Password Reset",
        text: "Your new password",
        html: `<h1>Your reset LInk</h1> <br><a href='${process.env.FRONTEND_URL}/reset-password/${token}'><span>Reset LInk</span></a>`,
      });

      return res.status(200).json(info);
    } catch (error) {
      return res.status(200).json(error);
    }
  } else {
    return res.status(200).json({ error: "Please give any string value" });
  }
};

//Reset Password
export const resetLink = async (req: Request, res: Response) => {
  const { userId, password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Please Enter field" });
  }

  if (typeof password === "string") {
    const decoded: any = await verifyJwtToken(userId);

    try {
      const user = await User.findOneAndUpdate(
        { _id: decoded._id },
        {
          password: await passwordHashed(password),
        }
      );

      return res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: "Password not Updated" });
    }
  } else {
    return res.status(400).json({ error: "Please give only string value" });
  }
};
