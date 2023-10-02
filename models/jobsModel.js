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
      enum: ["full-time", "part-time", "internship", "contract"],
      default: "full-time",
    },
    workLocation: {
      type: String,
      default: "Asia",
      required: [true, "Work location is required"],
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
