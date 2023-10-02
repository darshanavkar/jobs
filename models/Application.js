import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  listingId: { type: mongoose.Types.ObjectId, ref: 'Job', required: true },
  applicantId: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  createdBy: { type: mongoose.Types.ObjectId, ref: 'users' }, 
  status: { type: String, required: true, default: 'Applied' },
  appDate: { type: Date, required: true, default: Date.now },
  closeDate: {
    type: Date,
    default: () => Date.now() + 2 * 365 * 24 * 3600 * 1000,
  },
  sop: { type: String, default: '' },
  resume: { type: Buffer },
  name: { type: String }, // Add name field
  experience: { type: String }, // Add experience field
  position: { type: String }, // Add position field
  email: { type: String },
  jobDetails: {
   type: mongoose.Types.ObjectId // Store job-related data as an object
  },
});

export default mongoose.model('Application', ApplicationSchema);
