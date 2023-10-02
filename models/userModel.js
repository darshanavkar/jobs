import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
name:{
    type:String,
    required:true,
    trim:true
},
email:{
    type:String,
    required:true,
    unique:true,
    validate(value) {
        if (!validator.isEmail(value)) {
            throw new Error("Not Valid Email")
        }
    }
},
password:{
    type:String,
    required:true
},
phone:{
    type:String,
    required:true,
},
address:{
    type:{},
    required:true
},
answer:{
    type:String,
    required:true,
},
mode:{
    type:Number,
    default:0
},
role:{
    type:Number,
    default:0
},
verified: {
    type: Boolean,
    default: false,
  },
  customer:{
    type:String
  }
  


},{timestamps:true})
export default mongoose.model('users',userSchema)