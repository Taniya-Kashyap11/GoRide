const dotenv=require('dotenv');
dotenv.config();
const cors=require('cors');
const express=require('express');
const app=express();
const connectDb=require('./config/db');
app.use(cors());
const PORT=process.env.PORT;
app.listen(PORT,()=>{
    connectDb();
    console.log("Server is running ");
})