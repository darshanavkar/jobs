import express from "express";
import {
  createJobController,
  deleteJobController,
  getAllJobsController,
  jobStatsController,
  updateJobController,
  getJobDetailsController,
  getAllJobController,
  getApplicationsForJob,
  searchJobController,
  getResume,
  applicants
} from "../controllers/jobsController.js";
import { requireSignIn, isAdmin, isRecruiter } from '../middle/authMiddleware.js';

const router = express.Router();

//routes
// CREATE JOB || POST 
router.post("/create-job", requireSignIn, createJobController,);

//GET JOBS || GET
router.get("/get-job/:_id", getAllJobsController);
// GET JOB DETAILS || GET
router.get("/test-job/:_id", getJobDetailsController);

//get jobs for all
router.get('/jobs',getAllJobController);
//UPDATE JOBS ||  PATCH
router.patch("/update-job/:_id",  updateJobController);

//DELETE JOBS || DELETE
router.delete("/delete-job/:_id", deleteJobController);

// JOBS STATS FILTER || GET
router.get("/job-stats", requireSignIn, jobStatsController);

//jobs application
router.get("/applications/:listingId",getApplicationsForJob);
//resume download
router.get("/resume/:listingId",getResume);

//Jobs search
router.get("/search/:keyword", searchJobController);
//applicants
router.get('/applicants/:id',applicants);
export default router;