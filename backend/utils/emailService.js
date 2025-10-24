const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  return transporter;
};

/**
 * Send email with customizable template
 * @param {Object} options - Email options
 * @returns {Object} Send result
 */
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Corporate Gifting'}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: options.to,
      cc: options.cc,
      bcc: options.bcc,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments
    };

    const info = await transporter.sendMail(mailOptions);
    
    return {
      success: true,
      messageId: info.messageId,
      response: info.response
    };
  } catch (error) {
    console.error('Email send error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Send welcome email to new users
 * @param {Object} user - User object
 * @returns {Object} Send result
 */
const sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to Corporate Gifting Platform';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; }
        .footer { background: #343a40; color: #adb5bd; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
        .btn { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        .highlight { background: #e3f2fd; padding: 15px; border-left: 4px solid #2196f3; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Corporate Gifting!</h1>
          <p>Your account has been created successfully</p>
        </div>
        <div class="content">
          <h2>Hello ${user.firstName} ${user.lastName}!</h2>
          <p>Thank you for joining our Corporate Gifting platform. We're excited to help you discover amazing gifts for your corporate needs.</p>
          
          <div class="highlight">
            <h3>Account Details:</h3>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Role:</strong> ${user.role}</p>
            <p><strong>Account Type:</strong> ${user.accountType}</p>
          </div>

          <h3>What's Next?</h3>
          <ul>
            <li>Complete your profile information</li>
            <li>Browse our extensive product catalog</li>
            <li>Set up your corporate preferences</li>
            <li>Start creating your gift orders</li>
          </ul>

          <p style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/dashboard" class="btn">Visit Your Dashboard</a>
          </p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Corporate Gifting Platform. All rights reserved.</p>
          <p>If you have any questions, please contact our support team.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: user.email,
    subject,
    html
  });
};

/**
 * Send order confirmation email
 * @param {Object} order - Order object
 * @param {Object} user - User object
 * @returns {Object} Send result
 */
const sendOrderConfirmationEmail = async (order, user) => {
  const subject = `Order Confirmation - #${order.orderNumber}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; }
        .footer { background: #343a40; color: #adb5bd; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
        .order-details { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .total { font-weight: bold; font-size: 18px; color: #28a745; }
        .btn { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmed!</h1>
          <p>Thank you for your order</p>
        </div>
        <div class="content">
          <h2>Hello ${user.firstName}!</h2>
          <p>Your order has been confirmed and is being processed. Here are the details:</p>
          
          <div class="order-details">
            <h3>Order Information</h3>
            <p><strong>Order Number:</strong> #${order.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            ${order.isCorporateOrder ? `<p><strong>Corporate Order:</strong> Yes</p>` : ''}
            ${order.corporateDetails?.purchaseOrderNumber ? `<p><strong>PO Number:</strong> ${order.corporateDetails.purchaseOrderNumber}</p>` : ''}
          </div>

          <div class="order-details">
            <h3>Items Ordered</h3>
            ${order.items.map(item => `
              <div class="item">
                <div>
                  <strong>${item.product.name}</strong><br>
                  Quantity: ${item.quantity}
                </div>
                <div>$${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            `).join('')}
            <div class="item total">
              <div>Total Amount:</div>
              <div>$${order.totalAmount.toFixed(2)}</div>
            </div>
          </div>

          <div class="order-details">
            <h3>Shipping Address</h3>
            <p>
              ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
              ${order.shippingAddress.street}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
              ${order.shippingAddress.country}
            </p>
          </div>

          <p style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/orders/${order._id}" class="btn">Track Your Order</a>
          </p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Corporate Gifting Platform. All rights reserved.</p>
          <p>Order ID: ${order._id}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: user.email,
    subject,
    html
  });
};

/**
 * Send order status update email
 * @param {Object} order - Order object
 * @param {Object} user - User object
 * @param {string} newStatus - New order status
 * @returns {Object} Send result
 */
const sendOrderStatusUpdateEmail = async (order, user, newStatus) => {
  const statusMessages = {
    confirmed: 'Your order has been confirmed and is being prepared.',
    processing: 'Your order is currently being processed.',
    shipped: 'Great news! Your order has been shipped.',
    delivered: 'Your order has been delivered successfully.',
    cancelled: 'Your order has been cancelled.'
  };

  const subject = `Order Update - #${order.orderNumber} - ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Update</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #17a2b8 0%, #6610f2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; }
        .footer { background: #343a40; color: #adb5bd; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
        .status-update { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
        .btn { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        .tracking { background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Status Update</h1>
          <p>Order #${order.orderNumber}</p>
        </div>
        <div class="content">
          <h2>Hello ${user.firstName}!</h2>
          
          <div class="status-update">
            <h3>Status: ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}</h3>
            <p>${statusMessages[newStatus] || 'Your order status has been updated.'}</p>
          </div>

          ${order.trackingNumber ? `
            <div class="tracking">
              <h3>Tracking Information</h3>
              <p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>
              <p><strong>Carrier:</strong> ${order.carrier || 'Standard Shipping'}</p>
            </div>
          ` : ''}

          <p>You can track your order and view detailed information by clicking the button below.</p>

          <p style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/orders/${order._id}" class="btn">View Order Details</a>
          </p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Corporate Gifting Platform. All rights reserved.</p>
          <p>If you have any questions, please contact our support team.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: user.email,
    subject,
    html
  });
};

/**
 * Send corporate order approval notification
 * @param {Object} order - Order object
 * @param {Object} approver - Approver user object
 * @returns {Object} Send result
 */
const sendCorporateApprovalNotification = async (order, approver) => {
  const subject = `Corporate Order Approval Required - #${order.orderNumber}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Approval Required</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #fd7e14 0%, #e83e8c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; }
        .footer { background: #343a40; color: #adb5bd; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
        .order-summary { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .btn { display: inline-block; padding: 12px 24px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; margin: 5px; }
        .btn-deny { background: #dc3545; }
        .urgent { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Approval Required</h1>
          <p>Corporate Order Pending Approval</p>
        </div>
        <div class="content">
          <h2>Hello ${approver.firstName}!</h2>
          
          <div class="urgent">
            <strong>Action Required:</strong> A corporate order requires your approval before it can be processed.
          </div>

          <div class="order-summary">
            <h3>Order Details</h3>
            <p><strong>Order Number:</strong> #${order.orderNumber}</p>
            <p><strong>Order Amount:</strong> $${order.totalAmount.toFixed(2)}</p>
            <p><strong>PO Number:</strong> ${order.corporateDetails?.purchaseOrderNumber || 'N/A'}</p>
            <p><strong>Department:</strong> ${order.corporateDetails?.department || 'N/A'}</p>
            <p><strong>Requested By:</strong> ${order.customer.firstName} ${order.customer.lastName}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          </div>

          <p style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}/admin/orders/${order._id}/approve" class="btn">Approve Order</a>
            <a href="${process.env.FRONTEND_URL}/admin/orders/${order._id}" class="btn">View Full Details</a>
          </p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Corporate Gifting Platform. All rights reserved.</p>
          <p>Please review and approve this order at your earliest convenience.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: approver.email,
    subject,
    html
  });
};

/**
 * Send password reset email
 * @param {Object} user - User object
 * @param {string} resetToken - Password reset token
 * @returns {Object} Send result
 */
const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const subject = 'Password Reset Request';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; }
        .footer { background: #343a40; color: #adb5bd; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
        .btn { display: inline-block; padding: 12px 24px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        .security-notice { background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 8px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset</h1>
          <p>Reset your account password</p>
        </div>
        <div class="content">
          <h2>Hello ${user.firstName}!</h2>
          <p>You have requested to reset your password for your Corporate Gifting account.</p>
          
          <div class="security-notice">
            <strong>Security Notice:</strong> This password reset link will expire in 1 hour for your security.
          </div>

          <p>Click the button below to reset your password:</p>

          <p style="text-align: center;">
            <a href="${resetUrl}" class="btn">Reset Password</a>
          </p>

          <p>If you didn't request this password reset, please ignore this email. Your account remains secure.</p>
          
          <p><small>If the button doesn't work, copy and paste this link into your browser:<br>
          ${resetUrl}</small></p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Corporate Gifting Platform. All rights reserved.</p>
          <p>This is an automated message, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: user.email,
    subject,
    html
  });
};

/**
 * Send bulk email to multiple recipients
 * @param {Array} recipients - Array of email addresses
 * @param {string} subject - Email subject
 * @param {string} html - Email HTML content
 * @param {Object} options - Additional options
 * @returns {Object} Send results
 */
const sendBulkEmail = async (recipients, subject, html, options = {}) => {
  try {
    const results = [];
    const batchSize = 50; // Send in batches to avoid rate limiting
    
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (recipient) => {
        try {
          const result = await sendEmail({
            to: recipient,
            subject,
            html,
            ...options
          });
          return { recipient, ...result };
        } catch (error) {
          return {
            recipient,
            success: false,
            error: error.message
          };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Add delay between batches to avoid rate limiting
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    return {
      success: true,
      total: recipients.length,
      successful: successful.length,
      failed: failed.length,
      results
    };
  } catch (error) {
    console.error('Bulk email error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
  sendCorporateApprovalNotification,
  sendPasswordResetEmail,
  sendBulkEmail
};