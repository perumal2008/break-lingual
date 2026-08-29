require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const translateRoutes = require('./routes/translateRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', translateRoutes);
app.use('/api/auth', authRoutes);

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 2000, // Short timeout for hackathon demo
})
  .then(() => {
    console.log('MongoDB Connected successfully');
  })
  .catch(err => {
     console.log('MongoDB Connection Warning: Proceeding without DB (Mock mode active). Error:', err.message);
     // Disable buffering so save() fails immediately instead of timing out after 10 seconds
     mongoose.set('bufferCommands', false); 
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
