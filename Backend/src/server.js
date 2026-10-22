// const dotenv=require('dotenv');
// dotenv.config();
// const cors=require('cors');
// const express=require('express');
// const app=express();
// const connectDb=require('./config/db');
// const userRouter=require("../src/routes/userRoutes");
// const captainRouter=require("../src/routes/captainRoutes");
// const rideRouter = require("../src/routes/rideRoutes");
// const cookieParser=require("cookie-parser");
// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true
// }));
// app.use(express.json());
// app.use(cookieParser());
// app.use(express.urlencoded({extended:true}));
// app.use('/users',userRouter);
// app.use('/captains',captainRouter);
// app.use('/api/rides', rideRouter);
// const PORT=process.env.PORT;
// app.listen(PORT,()=>{
//     connectDb();
//     console.log("Server is running ");
// })

const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");

const connectDb = require("./config/db");
const userRouter = require("../src/routes/userRoutes");
const captainRouter = require("../src/routes/captainRoutes");
const rideRouter = require("../src/routes/rideRoutes");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRouter);
app.use("/captains", captainRouter);
app.use("/api/rides", rideRouter);

// Make io available to your controllers.
app.set("io", io);

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("joinUserRoom", (userId) => {
    if (userId) {
      socket.join(`user:${userId}`);
    }
  });

  socket.on("joinCaptainRoom", (captainId) => {
    if (captainId) {
      socket.join(`captain:${captainId}`);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;

connectDb()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });
