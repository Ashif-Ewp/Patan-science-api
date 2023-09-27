import twilio from "twilio";
import {UserReq} from "../models/User.js"

const accountSid = "AC8af3cee6e9b48bc5231528e9179f8630";
const authToken = "26c7b5904b83f12c2039f330694721e6";
const twilioClient = twilio(accountSid, authToken);

export const submit = async (req, res) => {
  try {
    const {name,
        email,
        mobile,
        city,
        option,
        query } = req.body;

    // Create a new form data document
    const formData = new UserReq({
        name,
        email,
        mobile,
        city,
        option,
        query,
    });
    
    // Save the form data to the database
    await formData.save();
    const smsMessage = `New form submission from ${name} - Email: ${email}, Mobile: ${mobile}, City: ${city}, Option: ${option}, Query: ${query}`;
    await twilioClient.messages.create({
      body: smsMessage,
      from: "+18146662447", 
      to: "+919548430311", 
    });
    res.status(200).json({ message: "Form submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to submit form" });
  }
};
