const Captain=require("../Models/Captain")
const captainService=require('../services/captainService');
const {validationResult}=require("express-validator");
const blacklistToken=require("../Models/blacklistToken");
async function registerCaptain(req,res,next){
    const errors=validationResult(req);
    if(!errors.isEmpty()){
       return res.status(400).json({errors:errors.array()});
    }
    const {fullname,email,password,vehicle}=req.body;
    const isCaptainAlreadyExist = await Captain.findOne({email});
    if(isCaptainAlreadyExist){
        return res.status(400).json({message:"Captain already exist"});
    }
    const hashedPassword=await Captain.hashPassword(password);
    const captain=await captainService.createCaptain({
        firstname:fullname.firstname,
        lastname:fullname.lastname,
        email,
        password:hashedPassword,
        color:vehicle.color,
        plate:vehicle.plate,
        capacity:vehicle.capacity,
        vehicleType:vehicle.vehicleType
    })
    const token= captain.generateAuthToken();
    res.status(201).json({token,captain});
}
async function loginCaptain(req,res,next){
 const errors=validationResult(req);
    if(!errors.isEmpty()){
       return res.status(400).json({errors:errors.array()});
    }
    const {email,password}=req.body;
    const captain= await Captain.findOne({email}).select('+password');
    if(!captain){
        return res.status(401).json({message:"Invalid email or password"});
    }
    const isMatch= await captain.comparePassword(password);
    if(!isMatch){
        return res.status(401).json({message:"Invalid email or password"});
    }
    const token=captain.generateAuthToken();
    res.cookie('token',token);
    res.status(200).json({token,captain});
}
async function getCaptainProfile(req,res,next){
    res.status(200).json({captain:req.captain});
}
async function logoutCaptain(req,res,next){
      res.clearCookie('token');
        const token=req.cookies.token || req.headers.authorization.split(' ')[1];
        await blacklistToken.create({token});
        res.status(200).json({message : 'Logged out'});
}
module.exports={
    registerCaptain,
    loginCaptain,
    getCaptainProfile,
    logoutCaptain
}