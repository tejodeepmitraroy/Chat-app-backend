import { Document, Schema, model } from "mongoose";
import { IUser } from "./userModel";
import { IMessage } from "./messageModel";

export interface IChat extends Document {
  chatName: string;
  description: string;
  groupImage: string;
  isGroupChat: boolean;
  users: IUser[];
  latestMessage: IMessage;
  groupAdmin: IUser;
}

const chatModel = new Schema<IChat>(
  {
    chatName: { type: String, trim: true },
    description: { type: String },
    groupImage: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/74/74577.png",
    },
    isGroupChat: { type: Boolean, default: false },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Chat = model<IChat>("Chat", chatModel);

export default Chat;
