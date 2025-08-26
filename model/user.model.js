// import { type } from "express/lib/response";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role:{
        type:String,
        enum:["user", "admin"],
        default:"user"
    },
    isverified:{
        type:Boolean,
        default:false,
    },
    verificationToken:{
        type:String,
    },

    resetpasswordToken:{
        type:String,
    },
    resetpasswordexpiry:{
    type:Date,
    }

},{
    timestamps:true,
}
);

userSchema.pre("save",async function (next) {
    if(this.isModified("password")){
        this.password= await bcrypt.hash(this.password,10)
    }

    next();
})


const User = mongoose.model("User",userSchema)

export default User;