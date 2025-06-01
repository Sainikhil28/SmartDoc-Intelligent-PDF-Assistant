require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const pdf = require('pdf-parse');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// MongoDB model
const PdfText = require('./models/PdfText');

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// 🔍 Call the Python NLP microservice
async function processTextWithPython(text) {
  try {
    const response = await axios.post('http://localhost:5001/process', { text });
    return response.data;
  } catch (error) {
    console.error('❌ Error calling Python service:', error.message);
    throw new Error('Python service failed');
  }
}

// 📤 Upload PDF, extract text, get summary/entities
app.post('/api/pdf/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdf(dataBuffer);
    const extractedText = data.text;

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    // Call Python Flask microservice (nlp_processor.py must be running)
    const { summary, entities } = await processTextWithPython(extractedText);

    // Save everything to MongoDB
    await new PdfText({
      filename: req.file.originalname,
      content: extractedText,
      summary: summary,
      entities: entities,
    }).save();

    // Send response to frontend
    res.json({
      text: extractedText,
      summary,
      entities,
    });
  } catch (err) {
    console.error('❌ Error processing PDF:', err.message);
    res.status(500).json({ error: 'Failed to process PDF', details: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
