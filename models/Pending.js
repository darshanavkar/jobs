import mongoose from "mongoose";

const verificationRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  name: String, // Add a field for 'name'
  email: String, // Add a field for 'email'
});

export default mongoose.model('VerificationRequest', verificationRequestSchema);
