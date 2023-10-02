import Job from "../models/jobsModel.js";
import Application from '../models/Application.js';
import mongoose from "mongoose";
import moment from "moment";

export const getAllJobsController = async (req, res) => {
    try {
      const createdBy = req.params._id; // Get the user ID from the authenticated user
     
      // Fetch only the jobs created by the logged-in user
      const jobs = await Job.find({createdBy});
      
      res.json({
        success: true,
        jobs,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error fetching jobs",
        error,
      });
    }
  
  };