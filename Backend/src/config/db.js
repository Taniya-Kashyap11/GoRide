const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();
async function connectDb( ) {
    try{
        await (mongoose.connect(process.env.MONGODB_URL));
        console.log("Database is connected");
    }catch(err){
        console.log(err);
    }
}
module.exports=connectDb;