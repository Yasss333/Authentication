import User from "../model/user.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

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
 
}

export { registeruser,verifyUser };
