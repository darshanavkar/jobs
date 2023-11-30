import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
  school: String,
  graduationYear: String,
  degreeAndMajor: String,
});

const profileSchema = new mongoose.Schema(
  {
    photo: {
      data: Buffer,
      contentType: String,
    },
    resume: {
      data: Buffer,
      contentType: String,
    },
    name: {
      type: String,
    },
    location: {
      type: String,
    },
    education: [educationSchema], // Use the educationSchema here
    skills: [String],
    bio: {
      type: String,
    },
    experience: {
      type: String,
    },
    jobTitle: {
      type: String,
      enum: ["Senior Manager", "Manager", "Senior Executive", "Junior Executive", "Entry level", "Non Executive"],
      default: "Senior Executive",
    },
    exp: {
      type: String,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
