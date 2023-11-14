import Job from "../models/jobsModel.js";
import Application from '../models/Application.js';
import mongoose from "mongoose";
import moment from "moment";
import nodemailer from 'nodemailer'
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "sameer@neuetrinostech.com", // your email address
    pass: "dtjwyxropsccpokv", // your email password
  },
});
// ====== CREATE JOB ======

export const createJobController = async (req, res) => {
  try {
    const { company, position, workLocation,level,exp, salary,currency, workType,description,   careerLink,  email} = req.body;
    const createdBy = req.user._id; // This will be the authenticated user's ID
     
    // Create the job with the createdBy field
    const job = await new Job({
      company,
      position,
      workLocation,
      workType,
      level,
      exp,
      description,
     salary,
     currency,
      careerLink,
      email,
      createdBy,
    }).save();

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      job,
    });
    const mailOptions = {
      from: "sameer@neuetrinostech.com",
      to: email, // Use the provided email from the request
      subject: "Congratulations! You've Created a New Job Listing",
      html: `
        <h1>Hello Recruiter!</h1>
        <p>Congratulations on creating a new job listing. You're one step closer to finding the perfect candidate for your team.</p>
        <p>Here are the details of the job:</p>
        <ul>
          <li><strong>Position:</strong> ${position}</li>
          <li><strong>Company:</strong> ${company}</li>
          <li><strong>Work Location:</strong> ${workLocation}</li>
          <!-- Include other job details as needed -->
        </ul>
        <p>We wish you the best of luck in finding the right talent!</p>
        <p>Thank you for using our platform.</p>
        <p>Best regards,</p>
        <p>JobSea team</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Error creating the job',
      error,
    });
  }
};

 

  
  
// ======= GET JOBS ===========
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

// ======= UPDATE JOBS ===========
export const updateJobController = async (req, res, next) => {
  const  _id  = req.params._id;
  const { company, position, workLocation,level,exp,workType,email,skillsRequired,benefits,careerLink } = req.body;

  try {
    // Find the job by its ID
    const jobs = await Job.findById(_id);

    if (!jobs) {
      return res.status(404).json({ error: `No job found with this ID: ${_id}` });
    }
    // Check if the user making the request is the same user who created the job
   

    // Update the job with the provided data
    jobs.company = company;
    jobs.position = position;
    jobs.workLocation = workLocation;
    jobs.level = level;
    jobs.exp=exp;
    jobs.workType = workType;
    jobs.benefits = benefits;          // ,
    jobs.skillsRequired = skillsRequired;
    jobs.careerLink = careerLink;
    jobs.email = email;

    const updatedJob = await jobs.save();
    const mailOptions = {
      from: "sameer@neuetrinostech.com",
      to: email, // Use the provided email from the request
      subject: "Your Job Listing has been Updated",
      html: `
        <h1>Hello Recruiter!</h1>
        <p>Your job listing for "${position}" at "${company}" has been successfully updated.</p>
        <p>Here are the updated details:</p>
        <ul>
          <li><strong>Position:</strong> ${position}</li>
          <li><strong>Company:</strong> ${company}</li>
          <li><strong>Work Location:</strong> ${workLocation}</li>
          <!-- Include other updated job details as needed -->
        </ul>
        <p>Thank you for using our platform.</p>
        <p>Best regards,</p>
        <p> JobSea Team</p>
      `,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  

    res.status(200).json({ jobs: updatedJob });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// ======= DELETE JOBS ===========
// ======= DELETE JOBS ===========
export const deleteJobController = async (req, res, next) => {
  const _id = req.params._id;
  try {
    // Find the job by its ID
    const job = await Job.findById(_id);

    // Validation - Check if the job with the given ID exists
    if (!job) {
      return res.status(404).json({ error: `No job found with this ID: ${_id}` });
    }

    // Delete the job
    await job.deleteOne();

    res.status(200).json({ message: "Success, Job Deleted!" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
// ======= get jo ===========
export const getJobDetailsController = async (req, res, next) => {
  const _id = req.params._id;
 

  try {
    // Find the job by its ID
    const job = await Job.findById(_id);

    if (!job) {
      console.log('No job found with this ID:', _id);
      return res.status(404).json({ error: `No job found with this ID: ${_id}` });
    }

   
    res.status(200).json({ job });
  } catch (error) {
    console.log('Error fetching job details:', error);
    next(error);
  }
};


// =======  JOBS STATS & FILTERS ===========
export const jobStatsController = async (req, res) => {
  const stats = await jobsModel.aggregate([
    // search by user jobs
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  //default stats
  const defaultStats = {
    pending: stats.pending || 0,
    reject: stats.reject || 0,
    interview: stats.interview || 0,
  };

  //monthly yearly stats
  let monthlyApplication = await jobsModel.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: {
          $sum: 1,
        },
      },
    },
  ]);
  monthlyApplication = monthlyApplication
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();
  res
    .status(200)
    .json({ totlaJob: stats.length, defaultStats, monthlyApplication });
};
/*=====getjobs=====*/


// Get all jobs
export const getAllJobController = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json({
      success: true,
      jobs,
    });
    //console.log(jobs);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error fetching jobs',
      error,
    });
  }
};


/*======application=======*/
export const getApplicationsForJob = async (req, res) => {
  try {
    const listingId = req.params.listingId;
    //console.log("Listing ID:", listingId);

    const applications = await Application.find({ listingId });
    
    
    res.json({
      success: true,
      applications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching applications",
      error,
    });
  }
};

export const getResume  = async (req, res) => {
  try {
    const listingId = req.params.listingId;
    const application = await Application.findOne({ listingId });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    const contentType = 'application/pdf'; // Set the appropriate content type
    const resumeBuffer = application.resume; // Assuming the resume data is stored in the 'resume' field
    
    res.setHeader('Content-Type', contentType);
    res.send(resumeBuffer);
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching application',
      error,
    });
  }
}

export const searchJobController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await Job
      .find({
        $or: [
          {  position: { $regex: keyword[0], $options: "i" } },

          { company: { $regex: keyword[2], $options: "i" } },
          { workLocation: { $regex: keyword[1], $options: "i" } },
          /*{ workType: { $regex: keyword[1], $options: "i" } },
          { description: { $regex: keyword[0], $options: "i" } },*/
        ],
      })
    
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};

// similar products
export const realtedJobController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await Jobs
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};

export const applicants = async (req, res) => {
  try {
    const listingIds = req.params.id;
    console.log('app', listingIds );
const listingId = 'jobDetails';

    // Query the Application model by ID using findById
    const application = await Application.find({ [listingId]: listingIds});

    

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Return the application details
    res.json({
      success: true,
      application
    });
  } catch (error) {
    console.error('Error getting application details:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting application details',
      error,
    });
  }
};


