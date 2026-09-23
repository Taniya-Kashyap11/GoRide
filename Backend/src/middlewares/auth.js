const User=require("../Models/User");
const Captain=require("../Models/Captain");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const BlacklistTokenModel = require("../Models/blacklistToken");
async function authUser(req,res,next) {
    const token=req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({message:'Unauthorized'});
    }
    const isBlacklisted=await BlacklistTokenModel.findOne({token : token})
    if(isBlacklisted){
        res.status(401).json({mesage:'unauthorized'})
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user=await User.findById(decoded._id);
        req.user=user;
        return next();
    }catch(err){
        return res.status(401).json({message :"unauthorized"});
    }
}
async function authCaptain(req,res,next) {
    const token=req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({message:'Unauthorized'});
    }
    const isBlacklisted=await BlacklistTokenModel.findOne({token : token})
    if(isBlacklisted){
        res.status(401).json({mesage:'unauthorized'})
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const captain=await Captain.findById(decoded._id);
        req.captain=captain;
        return next();
    }catch(err){
        return res.status(401).json({message :"unauthorized"});
    }
}
module.exports={authUser,
    authCaptain}