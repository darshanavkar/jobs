import express from 'express';
import {
  registerController,
  forgotPasswordController,
  loginController,
  testController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
  sendOTPController,
  verifyOTPController,
  verification,
  deleteRequestController,
  verificationRequest,
  verificationDetails,
  googleLogin,

} from '../controllers/authController.js';
import { requireSignIn, isAdmin } from '../middle/authMiddleware.js';
import passport from 'passport';


const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/google',googleLogin);
router.get('/test', requireSignIn, isAdmin, testController);
router.get('/user-auth', requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});
router.post('/forgot-password', forgotPasswordController);
router.put('/profile', requireSignIn, updateProfileController);
router.get('/orders', requireSignIn, getOrdersController);
router.get('/all-orders', requireSignIn, isAdmin, getAllOrdersController);
router.put('/order-status/:orderId', requireSignIn, isAdmin, orderStatusController);

// New routes for OTP verification
router.post('/send-otp', sendOTPController);
router.post('/verify-otp', verifyOTPController);
/// recruiter verification 
router.put('/approve-user/:id',verification);
router.post('/verification-request/:id',verificationRequest);
router.get('/verification-data',verificationDetails);
//recruiter delete verification request
router.delete('/verification-del/:id', deleteRequestController);


export default router;
