const dotenv=require('dotenv');
dotenv.config();
const cors=require('cors');
const express=require('express');
const app=express();
const connectDb=require('./config/db');
const userRouter=require("../src/routes/userRoutes");
const captainRouter=require("../src/routes/captainRoutes");
const cookieParser=require("cookie-parser");
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use('/users',userRouter);
app.use('/captains',captainRouter);
const PORT=process.env.PORT;
app.listen(PORT,()=>{
    connectDb();
    console.log("Server is running ");
})