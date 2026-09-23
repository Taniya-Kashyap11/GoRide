const express=require('express');
const userRouter=express.Router();
const {body}=require("express-validator");
const {registerUser,loginUser,userProfile}=require("../Controllers/userController")
const {authUser}=require('../middlewares/auth')
userRouter.post('/register',[body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min:3}).withMessage('First name must be at least 3 characters long'),
    body('password').isByteLength({min:6}).withMessage('Paswword must be in valid format')
],registerUser);
userRouter.post('/login',[body('email').isEmail().withMessage('Invalid Email'),  body('password').isByteLength({min:6}).withMessage('Paswword must be in valid format')
],loginUser)
userRouter.get('/profile',authUser,userProfile);
module.exports=userRouter;