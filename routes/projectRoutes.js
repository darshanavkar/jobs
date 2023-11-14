import express from "express";
import { createProjectController,getAllProjectController,getProjectDetailsController,getAllProjectsController ,updateProjectController,deleteProjectController} from "../controllers/projectController.js";

import { requireSignIn } from '../middle/authMiddleware.js';

const router = express.Router();

// CREATE project || POST 
router.post("/create-project", requireSignIn, createProjectController);
router.get("/get-project/:_id", getAllProjectController);
// GET project DETAILS || GET
router.get("/test-project/:_id", getProjectDetailsController);

//get projects for all
router.get('/projects',getAllProjectsController);
//UPDATE projectS ||  PATCH
router.patch("/update-project/:_id",  updateProjectController);

//DELETE projectS || DELETE
router.delete("/delete-project/:_id", deleteProjectController);

export default router;