
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from './models/Login.js';

const LoginRouter = express.Router();
// User registration
LoginRouter.post('/api/register', async (req, res) => {
  const { name, email, mobile, password } = req.body;

  // Check if the user already exists
  try{
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ error: 'User already exists' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save the user to the database
  const user = new User({ name, email, mobile, password: hashedPassword });
  await user.save();

  // Create and send the JWT
  const token = jwt.sign({ userId: user._id, email }, 'your-secret-key');
  res.json({ token });
}catch (error) {
    // Handle registration error
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// User login
LoginRouter.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Check if the password is correct
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Create and send the JWT
  const token = jwt.sign({ userId: user._id, email }, 'your-secret-key');
  res.json({ token });
});

// Protected route example
LoginRouter.get('/api/protected', (req, res) => {
  // Access the authenticated user data from the request
  const { userId, email } = req.user;
  // You can use this data to fetch user-specific information from the database
  res.json({ userId, email });
});


export default LoginRouter;