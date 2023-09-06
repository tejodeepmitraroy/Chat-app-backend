import { Schema, model } from "mongoose";
import { IUser } from "./userModel";
import { IChat } from "./chatModel";

export interface IMessage extends Document {
  sender: IUser;
  content: string;
  chat: IChat;
}

const messageModel = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      trim: true,
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
    },
  },
  {
    timestamps: true,
  }
);

const Message = model<IMessage>("Message", messageModel);

export default Message;
