import User from "../model/user.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { readdirSync } from "fs";
const registeruser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // create user
    const user = await User.create({ name, email, password, });
console.log("User created successfully");   
    console.log(user);
     

    // generate verification token
    const token = crypto.randomBytes(32).toString("hex");
    user.verficationToken = token;
    await user.save();

    // send verification email
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const mailOption = {
      from: process.env.MAILTRAP_SENDERMAIL,
      to: user.email,
      subject: "Verify your email",
      text: `Please click this link to verify your account: 
      ${process.env.BASE_URL}/api/v1/users/verify/${token}`,
      html: `<b>Please click this link to verify your account: 
      ${process.env.BASE_URL}/api/v1/users/verify/${token}</b>`,
    };

    await transporter.sendMail(mailOption);

    return res.status(201).json({
      message: "User registered successfully. Please verify your email.",
      user,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const verifyUser=async (req, res)=>{
 //get token
 //validate 
 // find user bases on token 
 //if not 
 //set is verified field to true 
 //remove verifaction token 
 //save 
 //return response 
 const{token}=req.params;

  console.log(token);
  if (!token) {
    return res.status(400).json({
      message:"Invalid Token "
    })
  }
     const user= await  User.findOne( {verficationToken:token})
if (!user) {
  return res.status(400).json({
    message:"Invalid User ",
  })
}

user.isverified=true ;
user.verficationToken=undefined;
 await user.save()
  


}

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your email before login" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, "shhhh", {
      expiresIn: "24h",
    });

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    };

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
      },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export { registeruser, verifyUser, login };