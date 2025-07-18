require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');

const app = express();
const port = process.env.PORT || 3000;

// Set SendGrid API Key from environment variable
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Configure CORS to allow only your specific frontend domains
const corsOptions = {
  origin: ['https://melbournecuratedstays.com.au', 'https://www.melbournecuratedstays.com.au'], // Restrict to your frontend domains
  methods: 'POST', // Only allow POST requests for your form
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions)); // Apply the configured CORS middleware
app.use(express.json());

// API endpoint for form submission
app.post('/submit-application', async (req, res) => {
    const { name, email, phone, propertyType, message } = req.body;

    // Basic validation
    if (!name || !email || !phone || !propertyType) {
        return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
    }

    try {
        // Email content for SendGrid
        const msg = {
            to: 'contact@melbournecuratedstays.com.au', // Your recipient email
            from: 'contact@melbournecuratedstays.com.au', // Your verified sender email in SendGrid
            subject: `New Partnership Application from ${name}`,
            html: `
                <p>You have received a new partnership application:</p>
                <ul>
                    <li><strong>Name:</strong> ${name}</li>
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Phone:</strong> ${phone}</li>
                    <li><strong>Property Type:</strong> ${propertyType}</li>
                    <li><strong>Message:</strong> ${message || 'N/A'}</li>
                </ul>
            `,
        };

        // Send the email using SendGrid
        await sgMail.send(msg);

        console.log('Email sent successfully via SendGrid!');
        res.status(200).json({ success: true, message: 'Application submitted successfully!' });

    } catch (error) {
        console.error('Error sending email via SendGrid:', error.response ? error.response.body : error);
        res.status(500).json({ success: false, message: 'Failed to send application. Please try again later.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});