import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"Smart Travel Planner" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
};

export const sendWelcomeEmail = async (user) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4F46E5;">Welcome to Smart Travel Planner! 🌍</h1>
      <p>Hi ${user.name},</p>
      <p>Thank you for joining Smart Travel Planner! We're excited to help you plan amazing trips.</p>
      <p>Get started by:</p>
      <ul>
        <li>Creating your first trip</li>
        <li>Exploring featured destinations</li>
        <li>Getting AI-powered recommendations</li>
      </ul>
      <a href="${process.env.CLIENT_URL}/destinations" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
        Explore Destinations
      </a>
    </div>
  `;
  
  return sendEmail(user.email, 'Welcome to Smart Travel Planner!', html);
};

export const sendTripReminderEmail = async (user, trip) => {
  const daysUntil = Math.ceil((new Date(trip.startDate) - new Date()) / (1000 * 60 * 60 * 24));
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4F46E5;">Trip Reminder 🗓️</h1>
      <p>Hi ${user.name},</p>
      <p>Your trip "${trip.title}" is coming up in ${daysUntil} days!</p>
      <p><strong>Destination:</strong> ${trip.destination?.name || 'Custom destination'}</p>
      <p><strong>Start Date:</strong> ${new Date(trip.startDate).toLocaleDateString()}</p>
      <a href="${process.env.CLIENT_URL}/trips/${trip._id}" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
        View Trip Details
      </a>
    </div>
  `;
  
  return sendEmail(user.email, `Trip Reminder: ${trip.title}`, html);
};

export const sendBudgetAlertEmail = async (user, trip) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #EF4444;">Budget Alert! 💰</h1>
      <p>Hi ${user.name},</p>
      <p>Your trip "${trip.title}" has exceeded its budget!</p>
      <p><strong>Budget:</strong> ${trip.budget.currency} ${trip.budget.total}</p>
      <p><strong>Spent:</strong> ${trip.budget.currency} ${trip.budget.spent}</p>
      <p><strong>Over Budget:</strong> ${trip.budget.currency} ${trip.budget.spent - trip.budget.total}</p>
      <a href="${process.env.CLIENT_URL}/trips/${trip._id}/budget" style="display: inline-block; background: #EF4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
        Review Budget
      </a>
    </div>
  `;
  
  return sendEmail(user.email, `Budget Alert: ${trip.title}`, html);
};
