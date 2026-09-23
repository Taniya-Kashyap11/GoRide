const Captain=require("../Models/Captain")
const captainService=require('../services/captainService');
const {validationResult}=require("express-validator");
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

}
async function getCaptainProfile(req,res,next){

}
async function logoutCaptain(req,res,next){

}
module.exports={
    registerCaptain,
    loginCaptain,
    getCaptainProfile,
    logoutCaptain
}