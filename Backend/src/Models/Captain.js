const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require("jsonwebtoken");
const captainSchema=new mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required:true,
            minLength:[2,'Firstname must be at least 2 characters long'],
        },
        lastname:{
             type:String,
            minLength:[2,'lastname must be at least 2 characters long'],
        }
    },email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        match:[/^\S+@\S+\.\S+$/,"please enter a valid email"]
    },
    password:{
        type:String,
        required:true
    },
    socketId:{
        type:String,
    },
    status:{
        type:String,
        enum:['active','inactive'],
        default:'inactive',
    },
    vehicle:{
        color:{
            type:String,
            requird:true,
            minLength:[3,'Color must be at least 3 characters long']
        },
        plate:{
            type:String,
            required:true,
            minLength:[3,'Plate must be at least 3 characters long'],
        },
        capacity:{
            type:Number,
            required:true,
            min:[1,"capacity must be at least 1"]
        },
        vehicleType:{
            type:String,
            required:true,
            enum:['car','motorcycle','auto']
        }
    },
    location:{
        lat:{
            type:Number,

        },
        lng:{
            type:Number
        }
    }
})
captainSchema.methods.generateAuthToken=function(){
    const token=jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn:'24h'});
    return token;
}
captainSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}
captainSchema.statics.hashPassword=async function(password){
    return await bcrypt.hash(password,10);
}
const Captain=mongoose.model('Captain',captainSchema);
module.exports=Captain;