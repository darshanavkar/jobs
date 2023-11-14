import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company name is required"],
    },
    position: {
      type: String,
      required: [true, "Job Position is required"],
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
    },
   
    workType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract"],
      default: "full-time",
    },
    level: {
      type: String,
      enum: ["Senior Manager", "Manager", "Senior Executive", "Junior Executive","Entry level","Non Executive"],
      default: "Senior Executive",
    },
    workLocation: {
      type: String,
      default: "Asia",
      required: [true, "Work location is required"],
    },
    exp: {
      type: String,
      enum: ["Fresher", "0-1 year", "1-2 year", "2-3 year","3-4 year","5-6 year","6-7 year","8+ year"],
      default: "1-2 year",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
  
    email: {
      type: String,
      
    },
    careerLink: {
      type: String,
    },
    currency:{
      type:String,
    },
    salary:{
  type:String,
    },
    skillsRequired: {
      type: [String], // An array of strings for skills
    },
    benefits: {
      type: [String], // An array of strings for benefits
    },
    
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
