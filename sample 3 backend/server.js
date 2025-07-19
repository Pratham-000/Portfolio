require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

// ✅ Fix 1: Call cors()
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : false}))

app.use('/api/contact', contactRoutes);

// ✅ Optional: log the Mongo URI to debug (remove in production)
console.log('Loaded Mongo URI:', process.env.MONGO_URI);

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB is connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// ✅ Fix 2: use function inside app.listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is started at http://localhost:${PORT}`);
});
