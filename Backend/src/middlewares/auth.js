const User=require("../Models/User");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
async function authUser(req,res,next) {
    const token=req.cookies.token || re.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({message:'Unauthorized'});
    }
    const isBlacklisted=await User.findOne({token : token})
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
module.exports=authUser;