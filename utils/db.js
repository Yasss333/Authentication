import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


  const db=()=>{
    mongoose
  .connect(process.env.MONGO_URL)
  .then(()=>{
    console.log("Mongoose connected ");
    
  })
  .catch((err)=>{
    console.log("Error connecting to mongo ");
  })
  }
  export default db