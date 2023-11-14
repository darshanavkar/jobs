import { compare } from "bcrypt";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import VerificationRequest from '../models/Pending.js';
import nodemailer from 'nodemailer';
const JWT_Secret = '$JF0E92$';
import JWT from 'jsonwebtoken';
import { stripe } from "../utils/stripe.js";
import passport from 'passport';
import userModel1 from "../models/userModel1.js";

//import orderModel from "../models/orderModel.js";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "sameer@neuetrinostech.com", // your email address
    pass: "dtjwyxropsccpokv", // your email password
  },
});

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer,role } = req.body;
    console.log(role);
    if (!name) {
      return res.send({ message: 'Name is required' });
    }
    if (!email) {
      return res.send({ message: 'Email is required' });
    }
    if (!password) {
      return res.send({ message: 'Password is required' });
    }
    if (!phone) {
      return res.send({ message: 'Phone is required' });
    }
    if (!address) {
      return res.send({ message: 'Address is required' });
    }
    if (!answer) {
      return res.send({ message: 'Answer is required' });
    }
    if (!role) {
      return res.send({ message: 'role is required' });
    }

    // Check if the user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: 'Already registered, please login',
      });
    }

    // Generate the verification token
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Set the mode based on the role
    let mode = 0; // Default mode for regular users
    if (role === 'recruiter') {
      mode = 1; // Set mode to 1 for recruiters
    }
    console.log(mode);
    // Hash the password
    const hashedPassword = await hashPassword(password);
    const customer = await stripe.customers.create({
      email: email
    }, {
      apiKey: process.env.STRIPE_SECRET_KEY
    });
    
    // Create the user with the hashed password and verification token
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
      otp,
      customer:customer.id,
      mode,

    }).save();

    // Send the OTP to the user's email
    

    res.status(201).send({
      success: true,
      message: 'User registered successfully',
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in registration',
      error,
    });
  }
};

export const sendOTPController = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'Email not found',
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    user.otp = otp;
    await user.save();
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: '🔐 Your One-Time Passcode for Registration',
      text: `Your OTP: ${user.otp}`,
      html: `
        <h1>Your One-Time Passcode: ${user.otp}</h1>
        <p>Use this OTP to finalize your registration process.</p>
        <p>It will help us ensure the security of your account.</p>
        <p>If you didn't initiate this registration, please disregard this email.</p>
        <p>Thank you for joining us! 😀</p>
      `
    };
    
    
    await transporter.sendMail(mailOptions);

    res.status(200).send({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error sending OTP',
      error,
    });
  }
};

export const verifyOTPController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'Email not found',
      });
    }

    // Check if the OTP is a string or a number
    if (user.otp && user.otp.toString() !== otp) {
      return res.status(200).send({
        success: false,
        message: 'Invalid OTP',
      });
    }

    // Clear the OTP after successful verification
    user.otp = undefined;
    user.verified = true; // Set the verified flag to true
    await user.save();

    
    // Send registration success email
    sendRegistrationSuccessEmail(user.email, user.name);

    res.status(200).send({
      success: true,
      message: 'OTP verification successful',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error verifying OTP',
      error,
    });
  }
};
const sendRegistrationSuccessEmail = (recipientEmail, recipientName) => {
  const mailOption = {
    from: process.env.EMAIL,
    to: recipientEmail,
    subject: '🎉 Welcome to Our Vibrant Community!',
    html: `
      <h1>Welcome aboard, ${recipientName}!</h1>
      <p>Congratulations on successfully joining our vibrant community!</p>
      <p>Your journey with us starts here, and we're excited to be part of it.</p>
      <p>🚀 What's waiting for you:</p>
      <ul>
        <li>Explore our exclusive job listings and unlock the doors to your dream job.</li>
        <li>Build an impeccable resume using our user-friendly resume builder.</li>
        <li>Connect with top-notch professionals in your industry and expand your network.</li>
        <li>Post job openings to find the perfect candidates and build your dream team.</li>
      </ul>
      <p>Remember, success awaits those who dare to dream and take action!</p>
      <p>Thank you for choosing us to be part of your journey. 🌟</p>
      <p>Looking forward to seeing you achieve greatness!</p>
      <p>Best regards,</p>
      <p>The JobSea Team</p>
    `,
  };

  transporter.sendMail(mailOption, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

export const loginController = async (req, res) => {
  try {
      const { email, password } = req.body;
      if (!email || !password) {
          return res.status(404).send({
              success: false,
              message: 'Invalid email or password',
          });
      }

      // Check user
      const user = await userModel.findOne({ email });
      if (!user) {
          return res.status(404).send({
              success: false,
              message: 'Email is not registered',
          });
      }

      const match = await comparePassword(password, user.password);
      if (!match) {
          return res.status(200).send({
              success: false,
              message: 'Invalid Password',
          });
      }

      const JWT_Secret = '$JF0E92$';

      // Initialize tokens array if it doesn't exist
      if (!user.tokens) {
          user.tokens = [];
      }

      // Generate a unique token for this session
      const token = await JWT.sign({ _id: user._id }, JWT_Secret, { expiresIn: '7d' });

      // Store the token in the user's document
      user.tokens.push(token);
      await user.save();

      res.status(200).send({
          success: true,
          message: 'Login successfully',
          user: {
              name: user.name,
              email: user.email,
              phone: user.phone,
              address: user.address,
              role: user.role,
              _id: user._id,
              customer: user.customer,
              mode: user.mode,
          },
          token,
      });
  } catch (error) {
      console.log(error);
      res.status(500).send({
          success: false,
          message: 'Error in login',
          error,
      });
  }
};


//google auth
export const googleLogin = async (req, res) => {
  try {
      const userData = req.body.user;
      let user = await userModel1.findOne({ email: userData.email });

      if (!user) {
          user = new userModel1(userData);
          await user.save();
      }

      const JWT_Secret = '$JF0E92$';
      const token = await JWT.sign({ _id: user._id }, JWT_Secret, { expiresIn: '7d' });

      // Initialize tokens array if it doesn't exist
      if (!user.tokens) {
          user.tokens = [];
      }

      // Store the token in the user's document
      user.tokens.push(token);
      await user.save();

      res.status(200).send({
          success: true,
          message: 'Login successfully',
          user: {
              name: user.name,
              email: user.email,
              role: user.role,
              _id: user._id,
              customer: user.customer,
              mode: user.mode,
          },
          token,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'An error occurred' });
  }
};
//test controller
export const testController = (req,res) => {
   console.log('protected')
   res.send("Protected");
}
//forgotPasswordController
export const forgotPasswordController = async(req,res) => {
    try{
        const {email,answer,newPassword} = req.body
        if(!email){
            res.status(400).send({message:'email is required'})
        }
        if(!answer){
            res.status(400).send({message:'answer is required'})
        }
        if(!newPassword){
            res.status(400).send({message:'NewPassword is required'})
        }
        //check
        const user = await userModel.findOne({email,answer})
        //validation
        if(!user) {
            return res.status(404).send({
                success:false,
                message:"wrong answer or email"
            })
        }
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id,{password:hashed});
        res.status(200).send({
            success:true,
            message:'Password reset successfully',
        })
    } catch(error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'something went wrong'
        })
    }
}
//update profile
export const updateProfileController = async (req, res) => {
    try {
      const { name, email, password, address, phone } = req.body;
      const user = await userModel.findById(req.user._id);
      //password
      if (password && password.length < 6) {
        return res.json({ error: "Passsword is required and 6 character long" });
      }
      const hashedPassword = password ? await hashPassword(password) : undefined;
      const updatedUser = await userModel.findByIdAndUpdate(
        req.user._id,
        {
          name: name || user.name,
          password: hashedPassword || user.password,
          phone: phone || user.phone,
          address: address || user.address,
        },
        { new: true }
      );
      res.status(200).send({
        success: true,
        message: "Profile Updated SUccessfully",
        updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error WHile Update profile",
        error,
      });
    }
  };

  //orders
  export const getOrdersController = async(req,res) => {
try{
const orders = await orderModel.find({buyer:req.user._id})
.populate("products","-photo")
.populate("buyer","name");
res.json(orders);


} catch(error) {
    console.log(error);
    res.status(500).send({
        success:false,
        message:"Error while getting orders",
        error
    })
}
  }

  //orders
export const getAllOrdersController = async (req, res) => {
    try {
      const orders = await orderModel
        .find({})
        .populate("products", "-photo")
        .populate("buyer", "name")
        .sort({ createdAt: "-1" });
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error WHile Geting Orders",
        error,
      });
    }
  };
  
  //order status
  export const orderStatusController = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const orders = await orderModel.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error While Updateing Order",
        error,
      });
    }
  };



  /////recruiter verified

// Route to update a user's role
export const verification = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if the user is an admin
    if (user.recruiter === 1) {
      return res.status(400).json({ msg: 'User is already an admin' });
    }

    // Update the user's role to 1 (admin)
    user.recruiter = 1;
    await user.save();

    res.json({ msg: 'User role updated to admin' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/// delete verification request
export const deleteRequestController = async (req, res, next) => {
  try {
    const user = await VerificationRequest.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    await user.deleteOne();

    res.status(200).json({ message: 'Success, request deleted!' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/// recruiter verification request

export const verificationRequest = async (req, res) => {
  try {
    const  userId  = req.params.id;
    //console.log(userId);
    const existingRequest = await VerificationRequest.findOne({ userId });
    const user = await userModel.findOne({ _id: userId });

  
    if (existingRequest) {
      return res.status(400).json({ msg: 'Request already exists' });
    }

    const newRequest = new VerificationRequest({
      userId,
      name: user.name,
      email: user.email,
    });
    await newRequest.save();

    res.json({ msg: 'Verification request submitted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Route to get all verification requests (for admins)
export const verificationDetails = async (req, res) => {
  try {
    const requests = await VerificationRequest.find();

    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};



