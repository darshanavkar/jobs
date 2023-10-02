import express from 'express';
import multer from 'multer';
import Application from '../models/Application.js';
import Job from "../models/jobsModel.js";
import { requireSignIn } from '../middle/authMiddleware.js';
const router = express.Router();

const storage = multer.memoryStorage(); // Store the uploaded file in memory
const upload = multer({ storage });

router.post('/apply',requireSignIn, upload.single('resume'), async (req, res) => {
  try {
    const { name, experience, position,email, sop, listingId } = req.body;
    const job = await Job.findById(listingId);
    const application = new Application({
      listingId,
      applicantId: req.user._id, // Assuming you have a user authentication mechanism
      status: 'Applied',
      sop,
      name,
      experience,
      position,
      email,
      jobDetails: 
        job.createdBy, // Store the createdBy data from the Job model
      
    });

    if (req.file) {
      application.resume = req.file.buffer; // Store the resume as a buffer
    }

    await application.save();

    res.json({
      success: true,
      message: 'Application submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting application',
      error,
    });
  }
});



export default router;