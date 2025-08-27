import User from "../model/user.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { log } from "console";

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
    const user = await User.create({ name, email, password });
    console.log("User created successfully");
    console.log(user);

    // generate verification token
    const token = crypto.randomBytes(32).toString("hex");
    user.verificationToken = token;
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

const verifyUser = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ message: "Invalid Token" });
  }

  const user = await User.findOne({ verificationToken: token });
  if (!user) {
    return res.status(400).json({ message: "Invalid User" });
  }

  user.isverified = true;
  user.verificationToken = undefined;
  await user.save();

  return res.status(200).json({
    message: "Email verified successfully! You can now login.",
  });
};

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

    if (!user.isverified) {
      return res
        .status(400)
        .json({ message: "Please verify your email before login" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

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

const getMe = async (req, res) => {
  try {
      // const user=await User.findById(req.user.id).select('-password')
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};


const logoutUser = async (req, res) => {
  try {
    res.cookie('token',' ',{
      expires:new Date(0)
    });
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {}
};
const forgotPassword = async (req, res) => {
  try {
    //email
    //  find user based on emial 
    //rest token +rest expiry=>date.now()+10*60*1000=>user.save(
    //send emai=>design url   
    const {email}=req.body;
    const user=await User.findOne({email})
    if (!user) {
      return res.status(400).json({
        message:"User not found "
      })
    }
    const resetToken =crypto.randomBytes(32).toString("hex")

   const hashedToken= crypto.createHash("sha256").update(resetToken).digest("hex")
   
    user.resetpasswordToken=hashedToken;
    user.resetpasswordexpiry=Date.now()+10*60*1000;
    await user.save()

    const resetUrl=`{process.env.BASE_URL}/api/v1/users/reset-password/${resetToken}`

    console.log("Reset Url "+ resetUrl);

    res.status(200).json({
      message:"Reset email send to you mail "
    })
    

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const resetPassword = async (req, res) => {
  try {
    const{token}=req.params
    const{password}=req.body
    try {
        const user=await  User.findOne({
          resetpasswordToken :token,
          resetpasswordexpiry:{$gt:Date.now()}
          //set password 
          //reset tokem ,reset expirt meaning clear them =>reset 
          //save 
        })    
    } catch (error) {
      
    }   
  } catch (error) {}
};
export { registeruser, verifyUser, login, getMe, logoutUser, forgotPassword };
