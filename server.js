import express, { application } from "express";
import morgan from "morgan";
import connectDB from "./db.js";
import authRoutes from "./routes/authRoutes.js";
import subsRoutes from "./routes/subs.js";
import applyRoutes from './routes/application.js';
import cors from "cors";
import jobsRoutes from "./routes/jobsRoute.js";
import webhookRoutes from './routes/subs1.js';
//import path from 'path';
//import {fileURLToPath} from 'url';
//es module fix
//const _filename =fileURLToPath(import.meta.url);
//const __dirname = path.dirname(_filename);
// Database config
connectDB();

// Create Express app
const app = express();

// Middleware
app.use(cors());
 // Parse JSON for non-webhook routes

// Custom middleware to handle raw body for the webhook route


app.use(morgan("dev"));
/*app.use(express.static('public')); */
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/subs1',webhookRoutes);
app.use(express.json());
// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/subs", subsRoutes);
app.use("/api/v1/job", jobsRoutes);
app.use("/api/v1/application",applyRoutes);
//app.use(express.static(path.join(__dirname,'./build')))
/*app.use('*',function(req,res) {
  res.sendFile(path.join(__dirname,'./build/index.html'));
}) */
app.get('/api/v1/subs/webhook', (req, res) => {
  res.send("stripe hook home page");
});
//stripe code 

// Rest API
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
