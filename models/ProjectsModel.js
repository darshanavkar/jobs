import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company name is required"],
    },
    title: {
      type: String,
      required: [true, "Job Position is required"],
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
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
    budget: {
      type: [String], // An array of strings for benefits
    },
    time: {
        type: String, // An array of strings for benefits
      },
      
  },
  { timestamps: true }
);

export default mongoose.model("Project", jobSchema);
