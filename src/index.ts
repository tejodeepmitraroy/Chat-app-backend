import express from"express";
import dotenv from"dotenv";
import userRoutes from "./routes/userRoutes";
import chatRoutes from "./routes/chatRoutes";
import messageRoutes from "./routes/messageRoutes";
// import { notFound, errorHandler } from "../middleware/errorMiddleware";
import path from "path";
import cors from "cors";
import connectDB from "./config/db";

const app = express();
dotenv.config();
connectDB();

app.use(express.json()); // to accept JSON data

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// ----------------------deployment-----------------------

// const __dirname1 = path.resolve();
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname1, "/frontend/build")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
//   });
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running Succesfully");
//   });
// }

//-----------------------Deployment------------------------

// app.use(notFound);
// app.use(errorHandler);

const PORT = process.env.PORT || 4000;

// const server = app.listen(PORT, console.log(`Server started on pORT ${PORT}`));
 app.listen(PORT,()=> console.log(`Server started on pORT ${PORT}`));

// const io = require("socket.io")(server, {
//   pingTimeout: 60000,
//   cors: {
//     origin: process.env.FRONTEND_URL,
//   },
// });

// io.on("connection", (socket) => {
//   console.log("Connected to socket.io");

//   socket.on("setup", (userData) => {
//     socket.join(userData._id);
//     console.log(userData._id);
//     socket.emit("connected");
//   });

//   socket.on("join chat", (room) => {
//     socket.join(room);
//     console.log("User Joined Room: " + room);
//   });

//   socket.on("typing", (room) => socket.in(room).emit("typing"));
//   socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

//   socket.on("new message", (newMessageRecieved) => {
//     var chat = newMessageRecieved.chat;

//     if (!chat.users) return console.log("chat.users not defined");

//     chat.users.forEach((user) => {
//       if (user._id == newMessageRecieved.sender._id) return;

//       socket.in(user._id).emit("message recieved", newMessageRecieved);
//     });
//   });

//   socket.off("setup", () => {
//     console.log("USER DISCONNECTED");
//     socket.leave(userData._id);
//   });
// });
