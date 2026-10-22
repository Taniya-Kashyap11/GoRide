const express=require('express');
const captainRouter=express.Router();
const {body}=require("express-validator");
const {authCaptain}=require("../middlewares/auth");
const {registerCaptain,getCaptainProfile,loginCaptain,logoutCaptain}=require("../Controllers/captainController");
captainRouter.post('/register', [
    body('email').trim().isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').trim().isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('fullname.lastname').trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('vehicle.color').trim().isLength({ min: 3 }).withMessage('Color must be at least 3 characters long'),
    body('vehicle.plate').trim().isLength({ min: 3 }).withMessage('Plate must be at least 3 characters long'),
    body('vehicle.capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
    body('vehicle.vehicleType').isIn([ 'car', 'motorcycle', 'auto' ]).withMessage('Invalid vehicle type')
],registerCaptain);
captainRouter.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],loginCaptain);
captainRouter.get('/profile',authCaptain,getCaptainProfile);
captainRouter.get('/logout',authCaptain,logoutCaptain);
module.exports=captainRouter;