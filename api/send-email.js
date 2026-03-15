const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, message } = req.body;

  // Debug check for environment variables in Vercel Logs
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('VERCEL ERROR: EMAIL_USER or EMAIL_PASS environment variables are missing!');
    return res.status(500).json({ message: 'Server configuration error (missing variables)' });
  }

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // SMTP Configuration
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Port 587 uses STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `New Portfolio Message from ${name}`,
    text: `You have a new message from your portfolio:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('NODEMAILER ERROR:', error);
    return res.status(500).json({ 
      message: 'Error sending email', 
      error: error.message 
    });
  }
};
