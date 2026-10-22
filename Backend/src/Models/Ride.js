// const mongoose=require('mongoose');
// const rideSchema=new mongoose.Schema({
//     user:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:'user',
//         required:true
//     },
//     captain:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:'captain',
//     },
//     pickup:{
//         type:String,
//         required:true,
//     },
//     destination:{
//         type:string,
//         required:true,
//     },
//     fare:{
//         type:Number,
//         required:true,
//     },
//     status:{
//         type:String,
//         enum:['pending','accepted','ongoing','completed','cancelled'],
//         default:'pending',
//     },
//     duration:{
//         type:Number,
//     },
//     distance:{
//         type:Number,
//     },
//     paymentId:{
//         type:String,
//     },
//     orderId:{
//         type:String,
//     },
//     signature:{
//         type:String,
//     },
//     otp:{
//         type:String,
//         select:false,
//         required:true
//     },
// })
// const Ride=new mongoose.model('ride',rideSchema);
// module.exports=Ride;

const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    pickup: {
      address: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lon: { type: Number, required: true },
      },
    },

    destination: {
      address: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lon: { type: Number, required: true },
      },
    },

    rideType: {
      type: String,
      enum: ["economy", "comfort", "premium", "xl"],
      required: true,
    },

    distanceKm: {
      type: Number,
      required: true,
      min: 0,
    },

    durationMinutes: {
      type: Number,
      required: true,
      min: 0,
    },

    fare: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "ongoing",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },

    captain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Captain",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ride", rideSchema);