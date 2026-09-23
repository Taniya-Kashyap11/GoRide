const { validationResult } = require('express-validator');
const userService=require('../services/userService');
const User = require('../Models/User');
const blacklistToken = require('../Models/blacklistToken');
async function registerUser(req,res,next) {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {fullname,email,password}=req.body;
      const isUserAlreadyExist = await User.findOne({email});
        if(isUserlreadyExist){
            return res.status(400).json({message:"User already exist"});
        }
    const hashedPassword=await User.hashPassword(password);
    const user=await userService.createUser({
        firstname:fullname.firstname,
        lastname:fullname.lastname,
        email,
        password:hashedPassword
    })
    const token=user.generateAuthToken();
    res.status(201).json({token,user})
}
async function loginUser(req,res,next){
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()}); 
    }
    const {email,password}=req.body;
    const user=await User.findOne({email}).select('+password');
    if(!user){
        return res.status(401).json({message :'Invalid email or password'});
    }
    const isMatch=await user.comparePassword(password);
    if(!isMatch){
        return res.status(401).json({message:"Invalid email or password"});
    }
    const token=user.generateAuthToken();
    res.cookie('token',token)
    res.status(200).json({token,user});
}
async function userProfile(req,res,next){
        res.status(200).json(req.user);
}
async function logoutUser(req,res,next){
        res.clearCookie('token');
        const token=req.cookies.token || rq.headers.authorization.split(' ')[1];
        await blacklistToken.create({token});
        res.status(200).json({message : 'Logged out'});
}
module.exports={
    registerUser,
    loginUser,
    userProfile,
    logoutUser
}