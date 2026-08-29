require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const translateRoutes = require('./routes/translateRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', translateRoutes);

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected successfully'))
  .catch(err => {
     console.log('MongoDB Connection Warning: Proceeding without DB (Mock mode active). Error:', err.message)
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
