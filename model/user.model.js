// import { type } from "express/lib/response";
import mongoose from "mongoose";

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
    verficationToken:{
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
});

const User = mongoose.model("User",userSchema)

export default User;