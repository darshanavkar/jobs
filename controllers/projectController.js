import Project from "../models/ProjectsModel.js";
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



// ====== CREATE freelance ======

export const createProjectController = async (req, res) => {
    try {
      const { company, title,description, skillsRequired , careerLink,budget,time, email} = req.body;
      const createdBy = req.user._id; // This will be the authenticated user's ID
       
      // Create the job with the createdBy field
      const project = await new Project({
        company,
        title,
        description,
        createdBy,
        email,
        careerLink,
        skillsRequired,
        budget,
        time,
      }).save();
  
      res.status(201).json({
        success: true,
        message: 'Project  created successfully',
        project,
      });
      const mailOptions = {
        from: "sameer@neuetrinostech.com",
        to: email, // Use the provided email from the request
        subject: "Congratulations! You've Created a New Project Listing",
        html: `
          <h1>Hello Recruiter!</h1>
          <p>Congratulations on creating a new Project listing. You're one step closer to finding the perfect candidate for your team.</p>
          <p>Here are the details of the job:</p>
          <ul>
            <li><strong>Title:</strong> ${title}</li>
            <li><strong>Company:</strong> ${company}</li>
            <li><strong>Time:</strong> ${time}</li>
            <!-- Include other job details as needed -->
          </ul>
          <p>We wish you the best of luck in finding the right talent!</p>
          <p>Thank you for using our platform.</p>
          <p>Best regards,</p>
          <p>projectsea team</p>
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
  
    

  // ======= GET projects ===========
export const getAllProjectController = async (req, res) => {
    try {
      const createdBy = req.params._id; // Get the user ID from the authenticated user
     
      // Fetch only the projects created by the logged-in user
      const projects = await Project.find({createdBy});
     
      res.json({
        success: true,
        projects,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error fetching projects",
        error,
      });
    }
  
  };
  
  // ======= UPDATE projects ===========
  export const updateProjectController = async (req, res, next) => {
    const  _id  = req.params._id;
    const { company, title,description, skillsRequired , careerLink,budget,time, email}  = req.body;
  
    try {
      // Find the job by its ID
      const projects = await Project.findById(_id);
  
      if (!projects) {
        return res.status(404).json({ error: `No job found with this ID: ${_id}` });
      }
      // Check if the user making the request is the same user who created the job
     
  
      // Update the job with the provided data
      projects.company = company;
      projects.title = title;
    
      projects.budget = budget;          // ,
      projects.skillsRequired = skillsRequired;
      projects.careerLink = careerLink;
      projects.email = email;
      projects.time=time;
      projects.description=description;
  
      const updatedJob = await projects.save();
      const mailOptions = {
        from: "sameer@neuetrinostech.com",
        to: email, // Use the provided email from the request
        subject: "Your Job Listing has been Updated",
        html: `
          <h1>Hello Recruiter!</h1>
          <p>Your Project post listing for "${title}" at "${company}" has been successfully updated.</p>
          <p>Here are the updated details:</p>
          <ul>
            <li><strong>Title:</strong> ${title}</li>
            <li><strong>Company:</strong> ${company}</li>
           
            <!-- Include other updated job details as needed -->
          </ul>
          <p>Thank you for using our platform.</p>
          <p>Best regards,</p>
          <p> projectsea Team</p>
        `,
      };
    
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
    
  
      res.status(200).json({ projects: updatedJob });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  
  // ======= DELETE projects ===========
  // ======= DELETE projects ===========
  export const deleteProjectController = async (req, res, next) => {
    const _id = req.params._id;
    try {
      // Find the job by its ID
      const project = await Project.findById(_id);
  
      // Validation - Check if the job with the given ID exists
      if (!project) {
        return res.status(404).json({ error: `No job found with this ID: ${_id}` });
      }
  
      // Delete the job
      await project.deleteOne();
  
      res.status(200).json({ message: "Success, Job Deleted!" });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  // ======= get jo ===========
  export const getProjectDetailsController = async (req, res, next) => {
    const _id = req.params._id;
   
  
    try {
      // Find the job by its ID
      const project = await Project.findById(_id);
  
      if (!project) {
        console.log('No job found with this ID:', _id);
        return res.status(404).json({ error: `No job found with this ID: ${_id}` });
      }
  
     
      res.status(200).json({ project });
    } catch (error) {
      console.log('Error fetching job details:', error);
      next(error);
    }
  };
  
    
  // Get all projects
export const getAllProjectsController = async (req, res) => {
    try {
      const projects = await Project.find();
      res.json({
        success: true,
        projects,
      });
      //console.log(projects);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: 'Error fetching projects',
        error,
      });
    }
  };
  
  
  /*======application=======*/
  export const getApplicationsForProject = async (req, res) => {
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
  
  export const searchProjectController = async (req, res) => {
    try {
      const { keyword } = req.params;
      const results = await Project
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
  
    