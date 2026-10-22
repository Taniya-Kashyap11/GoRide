const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();
async function connectDb() {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database is connected");
}
module.exports=connectDb;