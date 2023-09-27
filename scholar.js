// server.js
import express from "express";
import mongoose from "mongoose";
import twilio from "twilio";

const ScholeRouter = express.Router();

// Define MongoDB Schema and Model for Form Data
const formDataSchema = new mongoose.Schema({
  course: String,
  name: String,
  email: String,
  mobile: String,
  dob: String,
  board: String,
  gender: String,
  aadhar: String,
  parents: String,
  address: String,
});

const FormDataModel = mongoose.model("FormData", formDataSchema);

// Configure Twilio
const accountSid = "AC8af3cee6e9b48bc5231528e9179j8630";
const authToken = "26c7b5904b83f12c2039f330694721d6";
const twilioClient = twilio(accountSid, authToken);
const twilioPhoneNumber = "+18146662447";

// Helper function to generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store OTPs and their expiration time in memory (replace with a more secure storage for production)
const otpMap = new Map();

// API Endpoints

// Endpoint to send OTP using Twilio
ScholeRouter.post("/api/sendOTP", (req, res) => {
  const { mobile } = req.body;
  const otp = generateOTP();

  // Store the OTP and its expiration time (10 minutes from now) in memory
  const expirationTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  otpMap.set(mobile, { otp, expirationTime });

  // Send OTP to the user's mobile number using Twilio
  twilioClient.messages
    .create({
      body: `Your OTP is: ${otp}`,
      to: mobile,
      from: twilioPhoneNumber,
    })
    .then(() => {
      res.status(200).json({ otpSent: true });
    })
    .catch((error) => {
      console.error("Error sending OTP:", error);
      res.status(500).json({ error: "Failed to send OTP" });
    });
});

// Endpoint to verify OTP
ScholeRouter.post("/api/verifyOTP", (req, res) => {
  const { mobile, otp } = req.body;
  const storedOTPData = otpMap.get(mobile);

  if (storedOTPData && storedOTPData.otp === otp) {
    const currentTime = new Date();
    if (currentTime <= storedOTPData.expirationTime) {
      // OTP is valid and not expired
      otpMap.delete(mobile); // Remove OTP data from memory after successful verification
      res.status(200).json({ otpVerified: true });
    } else {
      // OTP has expired
      otpMap.delete(mobile); // Remove expired OTP data from memory
      res.status(400).json({ error: "OTP has expired" });
    }
  } else {
    // Invalid OTP or OTP not found in memory
    res.status(400).json({ error: "Invalid OTP" });
  }
});

// Endpoint to save form data to MongoDB
ScholeRouter.post("/api/saveForm", async (req, res) => {
  const formData = req.body;
  try {
    const savedFormData = await FormDataModel.create(formData);
    res.status(201).json(savedFormData);
  } catch (error) {
    console.error("Error saving form data:", error);
    res.status(500).json({ error: "Failed to save form data" });
  }
});


export default ScholeRouter