const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { sendEmail } = require('../utils/sendEmail');

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const contact = await Contact.create({ name, email, message }); // This saves automatically

    await sendEmail({ name, email, message });

    res.status(200).json({ message: 'Message sent successfully' });
  } 

  catch (error) {
  console.error("Error in POST /api/contact:", error);
  res.status(500).json({ error: 'Server error' });
}

});

module.exports = router;
