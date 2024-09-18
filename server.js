const express = require('express');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const mongoose = require('mongoose');
const OAuth2 = google.auth.OAuth2;
const app = express();
app.use(express.json());

// OAuth 2.0 configuration
const oauth2Client = new OAuth2(
    '833113077213-6fj1uk6fq9oio0g519q9alpgt6iulbia.apps.googleusercontent.com',
    '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',
    'https://developers.google.com/oauthplayground' // Redirect URL
);

oauth2Client.setCredentials({
    refresh_token: '1//04Sq5eP1ZfsLLCgYIARAAGAQSNwF-L9IrtKe5z-pcSg8Z2gq2NOpTKStgko4qDVo9Vj3xO7i8aEJ5rcZ8tEL7vJ3fW9so6kaYLio'
});

// Connect to MongoDB
mongoose.connect('mongodb+srv://aarnavsingh836:Cucumber1729@rr.oldse8x.mongodb.net/?retryWrites=true&w=majority&appName=rr', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// New schema for user-specific categories and entries
const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    phoneNumber: String,
    password: String,
    categories: {
        income: [String],
        expenditure: [String],
        investment: [String]
    },
    entries: [{
        date: String,
        amount: Number,
        method: String,
        category: String,
        type: String, // income, expenditure, investment
    }]
});

const UserFinance = mongoose.model('UserFinance', userSchema);

// Function to send OTP email
async function sendOtpEmail(email, otp) {
    try {
        const accessToken = await oauth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'aarnavsingh836@gmail.com',
                clientId: '833113077213-6fj1uk6fq9oio0g519q9alpgt6iulbia.apps.googleusercontent.com',
                clientSecret: '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',
                refreshToken: '1//04Sq5eP1ZfsLLCgYIARAAGAQSNwF-L9IrtKe5z-pcSg8Z2gq2NOpTKStgko4qDVo9Vj3xO7i8aEJ5rcZ8tEL7vJ3fW9so6kaYLio',
                accessToken: accessToken.token
            }
        });

        const mailOptions = {
            from: 'CAT <aarnavsingh836@gmail.com>',
            to: email,
            subject: 'Your OTP for CAT Registration',
            text: `Your OTP is: ${otp}`
        };

        const result = await transport.sendMail(mailOptions);
        return result;
    } catch (error) {
        console.error('Error sending OTP:', error);
    }
}

// OTP generation and user registration route
app.post('/register', async (req, res) => {
    const { email, fullName, phoneNumber, password } = req.body;

    // Generate OTP (6-digit random number)
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Store OTP in session or database (for simplicity, I’m using an in-memory object here)
    const otpStorage = {};
    otpStorage[phoneNumber] = otp; // In production, use a database to store OTP securely

    // Send OTP email
    const emailResult = await sendOtpEmail(email, otp);

    if (emailResult) {
        res.status(200).json({ message: 'OTP sent successfully', phoneNumber });
    } else {
        res.status(500).json({ message: 'Failed to send OTP' });
    }
});

// OTP verification route
app.post('/verify-otp', (req, res) => {
    const { enteredOtp, phoneNumber } = req.body;

    // Retrieve the actual OTP from storage
    const actualOtp = otpStorage[phoneNumber];

    // Compare entered OTP with actual OTP
    if (parseInt(enteredOtp) === actualOtp) {
        res.status(200).json({ message: 'OTP verified successfully' });
        // Proceed with further actions, e.g., create user, log in, etc.
    } else {
        res.status(400).json({ message: 'Invalid OTP' });
    }
});

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});