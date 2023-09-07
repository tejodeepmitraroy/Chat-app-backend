import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/userModel";
import { verifyJwtToken } from "../config/token/token";

declare global {
  namespace Express {
    interface Request {
      user: {
        _id: string;
        name: string;
        email: string;
        image: string;
      }; // Add your custom property and its type here
    }
  }
}

export const authentication = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];

        //decode token id
        // const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        const decoded: any = verifyJwtToken(token);

        const user = await User.findById(decoded._id).select("-password");
        req.user = user!;

        next();
      } catch (error) {
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
    }

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  }
);
