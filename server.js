 // server.js
//  const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bodyParser = require('body-parser');

// const app = express();

// // Middleware
// app.use(bodyParser.json());

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     credentials: true,
//   })
// );

// // Connect to MongoDB
// mongoose.connect('mongodb+srv://pandeykaran1515:WGVFgdFMehBenwD3@cluster0.fskapil.mongodb.net/?retryWrites=true&w=majority', {
// }).then(() => console.log('MongoDB Connected'))
//   .catch(err => console.log(err));

// // Create mongoose schema
 
// const ContactSchema = new mongoose.Schema({
//   fullName: String,
//   mobileNo: String, 
// });


// // Create mongoose model
// const Contact = mongoose.model('liveupdate', ContactSchema);

// // POST route to handle form submission
// app.post('/submit-form', (req, res) => {
//   const formData = req.body;
//   const newContact = new Contact(formData);
//   newContact.save()
//     .then(() => res.status(200).json({ message: 'Form submitted successfully' }))
//     .catch(err => res.status(400).json({ error: 'Error submitting form', details: err }));
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
 

const app = express();

// Middleware
app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// Connect to MongoDB
mongoose.connect('mongodb+srv://pandeykaran1515:WGVFgdFMehBenwD3@cluster0.fskapil.mongodb.net/?retryWrites=true&w=majority', {
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Create mongoose schema
 
const ContactSchema = new mongoose.Schema({
  fullName: String,
  mobileNo: String,
  status: { type: Boolean, default: false } // Default status is false, meaning not eligible
  
});


// Create mongoose model
const Contact = mongoose.model('liveupdate', ContactSchema);

// POST route to handle form submission
app.post('/submit-form', (req, res) => {
  const formData = req.body;
  const newContact = new Contact(formData);
  newContact.save()
    .then(() => res.status(200).json({ message: 'Form submitted successfully' }))
    .catch(err => res.status(400).json({ error: 'Error submitting form', details: err }));
});

// Backend route to check user status
app.get('/check-status/:mobileNo', async (req, res) => {
  try {
      const mobileNo = req.params.mobileNo;
      const contact = await Contact.findOne({ mobileNo });
      if (!contact) {
          return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ status: contact.status });
  } catch (error) {
      console.error('Error checking status:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
}); 
// Backend route to update status
app.post('/update-status', async (req, res) => {
  try {
      const { mobileNo, status } = req.body;
      // Find the user by mobile number
      const contact = await Contact.findOneAndUpdate({ mobileNo }, { status }, { new: true });
      if (!contact) {
          return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ message: 'Status updated successfully', contact });
  } catch (error) {
      console.error('Error updating status:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});



// Start server
const PORT =  5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
