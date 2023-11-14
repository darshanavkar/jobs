import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    googleId: String,
    displayName: String,
    email: { type: String, required: true }, // Email is required
    name: { type: String, required: true }, // Name is required
    answer: String, // Make answer optional
    address: String, // Make address optional
    phone: String, // Make phone optional
    password: String,
    mode:{
        type:Number,
        default:0
    },
    tokens: [
      {
          type: String,
      },
  ],
    role:{
        type:Number,
        default:0
    },
    recruiter: {
        type: Number,
        default: 0, // Default role is 0 (non-admin)
      },
   
      customer:{
        type:String
      }, // Add a password field for local authentication
    // Add more fields as needed
  });
  export default mongoose.model('users1',userSchema)