const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  } else {
    // Generic SMTP configuration
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
};

// Send email function
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `Corporate Gifting Platform <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.message
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', {
      messageId: info.messageId,
      to: options.email,
      subject: options.subject
    });

    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Email could not be sent');
  }
};

// Send bulk emails (for newsletters, notifications, etc.)
const sendBulkEmail = async (recipients, subject, message) => {
  try {
    const transporter = createTransporter();
    const results = [];

    // Send emails in batches to avoid rate limiting
    const batchSize = 50;
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      
      const promises = batch.map(async (recipient) => {
        try {
          const mailOptions = {
            from: `Corporate Gifting Platform <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
            to: recipient.email,
            subject: subject,
            html: message.replace('{{firstName}}', recipient.firstName || 'Valued Customer')
          };

          const info = await transporter.sendMail(mailOptions);
          return {
            email: recipient.email,
            success: true,
            messageId: info.messageId
          };
        } catch (error) {
          console.error(`Failed to send email to ${recipient.email}:`, error);
          return {
            email: recipient.email,
            success: false,
            error: error.message
          };
        }
      });

      const batchResults = await Promise.allSettled(promises);
      results.push(...batchResults.map(result => 
        result.status === 'fulfilled' ? result.value : { 
          success: false, 
          error: result.reason?.message || 'Unknown error' 
        }
      ));

      // Add delay between batches to respect rate limits
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  } catch (error) {
    console.error('Bulk email sending failed:', error);
    throw new Error('Bulk emails could not be sent');
  }
};

// Email templates
const emailTemplates = {
  welcome: (firstName) => `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <h2 style="color: #333; text-align: center;">Welcome to Corporate Gifting Platform!</h2>
      <p>Dear ${firstName},</p>
      <p>Thank you for joining our corporate gifting platform. We're excited to help you find the perfect gifts for your team and clients.</p>
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #007bff; margin-top: 0;">What's Next?</h3>
        <ul>
          <li>Explore our extensive catalog of corporate gifts</li>
          <li>Set up your corporate account for bulk pricing</li>
          <li>Create your first order with custom branding options</li>
        </ul>
      </div>
      <p>If you have any questions, our support team is here to help.</p>
      <p>Best regards,<br>Corporate Gifting Platform Team</p>
    </div>
  `,

  orderConfirmation: (firstName, orderNumber, orderTotal) => `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <h2 style="color: #28a745; text-align: center;">Order Confirmed!</h2>
      <p>Dear ${firstName},</p>
      <p>Thank you for your order. Your order has been confirmed and is being processed.</p>
      <div style="background-color: #e8f5e8; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745;">
        <h3 style="margin-top: 0;">Order Details:</h3>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>Total Amount:</strong> ₹${orderTotal.toLocaleString()}</p>
      </div>
      <p>You will receive another email with tracking information once your order ships.</p>
      <p>Best regards,<br>Corporate Gifting Platform Team</p>
    </div>
  `,

  orderShipped: (firstName, orderNumber, trackingNumber) => `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <h2 style="color: #007bff; text-align: center;">Your Order Has Shipped!</h2>
      <p>Dear ${firstName},</p>
      <p>Great news! Your order is on its way.</p>
      <div style="background-color: #e3f2fd; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #007bff;">
        <h3 style="margin-top: 0;">Shipping Details:</h3>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
      </div>
      <p>You can track your package using the tracking number provided above.</p>
      <p>Best regards,<br>Corporate Gifting Platform Team</p>
    </div>
  `,

  corporateApproval: (firstName, companyName, approved) => `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <h2 style="color: ${approved ? '#28a745' : '#dc3545'}; text-align: center;">
        Corporate Account ${approved ? 'Approved' : 'Update'}
      </h2>
      <p>Dear ${firstName},</p>
      ${approved 
        ? `<p>Congratulations! Your corporate account for ${companyName} has been approved.</p>
           <div style="background-color: #e8f5e8; padding: 20px; border-radius: 5px; margin: 20px 0;">
             <h3 style="color: #28a745; margin-top: 0;">Benefits Unlocked:</h3>
             <ul>
               <li>Bulk pricing discounts</li>
               <li>Custom branding options</li>
               <li>Dedicated account manager</li>
               <li>Priority support</li>
             </ul>
           </div>`
        : `<p>Thank you for your interest in our corporate program for ${companyName}.</p>
           <p>After review, we need additional information before approving your account. Please contact our support team.</p>`
      }
      <p>Best regards,<br>Corporate Gifting Platform Team</p>
    </div>
  `
};

module.exports = {
  sendEmail,
  sendBulkEmail,
  emailTemplates
};