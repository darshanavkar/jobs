import express from "express";
import {  createProfileController, getProfileController, updateProfileController} from '../controllers/profileController.js'
import { requireSignIn } from "../middle/authMiddleware.js";
import formidable from "express-formidable";
import multer from 'multer';
const upload = multer()
const router = express.Router();
// CREATE profile || POST 
router.post("/create-profile",   upload.fields([{ name: 'photo' }, { name: 'resume' }]),requireSignIn,createProfileController);
router.put('/update/:createdBy',upload.fields([{ name: 'photo' }, { name: 'resume' }]), updateProfileController);
router.get('/profile/:createdBy', getProfileController);

export default router;