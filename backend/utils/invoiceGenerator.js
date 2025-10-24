const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generate invoice PDF for an order
 * @param {Object} order - Order object with populated fields
 * @param {Object} company - Company information
 * @returns {Buffer} PDF buffer
 */
const generateInvoicePDF = async (order, company = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];
      
      // Collect PDF data
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      doc.on('error', reject);

      // Company information (default values)
      const companyInfo = {
        name: company.name || 'Corporate Gifting Platform',
        address: company.address || '123 Business Ave',
        city: company.city || 'Business City',
        state: company.state || 'BC',
        zipCode: company.zipCode || '12345',
        phone: company.phone || '(555) 123-4567',
        email: company.email || 'info@corporategifting.com',
        website: company.website || 'www.corporategifting.com',
        taxId: company.taxId || 'Tax ID: 12-3456789',
        ...company
      };

      // Header
      doc.fontSize(20).text(companyInfo.name, 50, 50, { align: 'left' });
      doc.fontSize(10)
         .text(companyInfo.address, 50, 80)
         .text(`${companyInfo.city}, ${companyInfo.state} ${companyInfo.zipCode}`, 50, 95)
         .text(`Phone: ${companyInfo.phone}`, 50, 110)
         .text(`Email: ${companyInfo.email}`, 50, 125);

      // Invoice title and number
      doc.fontSize(24).text('INVOICE', 400, 50, { align: 'right' });
      doc.fontSize(12)
         .text(`Invoice #: ${order.orderNumber}`, 400, 80, { align: 'right' })
         .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 400, 100, { align: 'right' })
         .text(`Due Date: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}`, 400, 120, { align: 'right' });

      // Line separator
      doc.strokeColor('#aaaaaa')
         .lineWidth(1)
         .moveTo(50, 160)
         .lineTo(550, 160)
         .stroke();

      // Bill To section
      let currentY = 180;
      doc.fontSize(14).fillColor('#444444').text('Bill To:', 50, currentY);
      
      currentY += 20;
      doc.fontSize(12).fillColor('#000000')
         .text(`${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`, 50, currentY)
         .text(order.shippingAddress.street, 50, currentY + 15)
         .text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`, 50, currentY + 30)
         .text(order.shippingAddress.country, 50, currentY + 45);

      // Corporate details if applicable
      if (order.isCorporateOrder && order.corporateDetails) {
        doc.fontSize(14).fillColor('#444444').text('Corporate Details:', 300, currentY);
        doc.fontSize(12).fillColor('#000000');
        
        if (order.corporateDetails.purchaseOrderNumber) {
          doc.text(`PO Number: ${order.corporateDetails.purchaseOrderNumber}`, 300, currentY + 20);
        }
        if (order.corporateDetails.department) {
          doc.text(`Department: ${order.corporateDetails.department}`, 300, currentY + 35);
        }
        if (order.corporateDetails.budgetCode) {
          doc.text(`Budget Code: ${order.corporateDetails.budgetCode}`, 300, currentY + 50);
        }
      }

      currentY += 100;

      // Items table header
      const tableTop = currentY;
      doc.fontSize(12).fillColor('#444444');
      
      // Table headers
      doc.text('Item', 50, tableTop)
         .text('Qty', 350, tableTop, { width: 50, align: 'right' })
         .text('Price', 400, tableTop, { width: 70, align: 'right' })
         .text('Total', 470, tableTop, { width: 80, align: 'right' });

      // Table header underline
      doc.strokeColor('#aaaaaa')
         .lineWidth(1)
         .moveTo(50, tableTop + 15)
         .lineTo(550, tableTop + 15)
         .stroke();

      currentY = tableTop + 30;

      // Items
      let subtotal = 0;
      doc.fillColor('#000000');
      
      order.items.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        // Item name and description
        const itemName = item.product?.name || 'Product';
        doc.fontSize(10)
           .text(itemName, 50, currentY, { width: 280 })
           .text(item.quantity.toString(), 350, currentY, { width: 50, align: 'right' })
           .text(`$${item.price.toFixed(2)}`, 400, currentY, { width: 70, align: 'right' })
           .text(`$${itemTotal.toFixed(2)}`, 470, currentY, { width: 80, align: 'right' });

        // Add product description if available
        if (item.product?.description) {
          currentY += 12;
          doc.fontSize(8)
             .fillColor('#666666')
             .text(item.product.description.substring(0, 100) + '...', 50, currentY, { width: 280 });
          doc.fillColor('#000000');
        }

        currentY += 25;
      });

      // Totals section
      currentY += 20;
      const totalsStartY = currentY;

      // Subtotal
      doc.fontSize(12)
         .text('Subtotal:', 400, currentY, { align: 'right' })
         .text(`$${subtotal.toFixed(2)}`, 470, currentY, { width: 80, align: 'right' });

      currentY += 20;

      // Discount if applicable
      if (order.discountAmount > 0) {
        doc.text('Discount:', 400, currentY, { align: 'right' })
           .text(`-$${order.discountAmount.toFixed(2)}`, 470, currentY, { width: 80, align: 'right' });
        currentY += 20;
      }

      // Tax
      const taxAmount = order.taxAmount || 0;
      if (taxAmount > 0) {
        doc.text('Tax:', 400, currentY, { align: 'right' })
           .text(`$${taxAmount.toFixed(2)}`, 470, currentY, { width: 80, align: 'right' });
        currentY += 20;
      }

      // Shipping
      const shippingAmount = order.shippingCost || 0;
      if (shippingAmount > 0) {
        doc.text('Shipping:', 400, currentY, { align: 'right' })
           .text(`$${shippingAmount.toFixed(2)}`, 470, currentY, { width: 80, align: 'right' });
        currentY += 20;
      }

      // Total line
      doc.strokeColor('#aaaaaa')
         .lineWidth(1)
         .moveTo(400, currentY)
         .lineTo(550, currentY)
         .stroke();

      currentY += 10;

      // Total amount
      doc.fontSize(14)
         .fillColor('#000000')
         .text('Total:', 400, currentY, { align: 'right' })
         .text(`$${order.totalAmount.toFixed(2)}`, 470, currentY, { width: 80, align: 'right' });

      // Payment information
      currentY += 50;
      doc.fontSize(12)
         .fillColor('#444444')
         .text('Payment Information:', 50, currentY);

      currentY += 20;
      doc.fontSize(10)
         .fillColor('#000000')
         .text(`Payment Method: ${order.paymentMethod}`, 50, currentY);

      if (order.paymentStatus) {
        doc.text(`Payment Status: ${order.paymentStatus}`, 50, currentY + 15);
      }

      // Special instructions
      if (order.specialInstructions) {
        currentY += 50;
        doc.fontSize(12)
           .fillColor('#444444')
           .text('Special Instructions:', 50, currentY);
        
        currentY += 20;
        doc.fontSize(10)
           .fillColor('#000000')
           .text(order.specialInstructions, 50, currentY, { width: 500 });
      }

      // Footer
      const footerY = 720;
      doc.fontSize(8)
         .fillColor('#666666')
         .text('Thank you for your business!', 50, footerY, { align: 'center', width: 500 })
         .text(`${companyInfo.name} | ${companyInfo.website} | ${companyInfo.taxId}`, 50, footerY + 15, { align: 'center', width: 500 });

      // Finalize the PDF
      doc.end();

    } catch (error) {
      console.error('PDF generation error:', error);
      reject(error);
    }
  });
};

/**
 * Generate packing slip PDF for an order
 * @param {Object} order - Order object with populated fields
 * @returns {Buffer} PDF buffer
 */
const generatePackingSlipPDF = async (order) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      doc.on('error', reject);

      // Header
      doc.fontSize(24).text('PACKING SLIP', 50, 50);
      doc.fontSize(12)
         .text(`Order #: ${order.orderNumber}`, 50, 85)
         .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 50, 105);

      // Shipping information
      let currentY = 140;
      doc.fontSize(14).text('Ship To:', 50, currentY);
      
      currentY += 25;
      doc.fontSize(12)
         .text(`${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`, 50, currentY)
         .text(order.shippingAddress.street, 50, currentY + 20)
         .text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`, 50, currentY + 40)
         .text(order.shippingAddress.country, 50, currentY + 60);

      currentY += 120;

      // Items table
      doc.fontSize(12).text('Items to Pack:', 50, currentY);
      currentY += 25;

      // Table headers
      doc.text('Item', 50, currentY)
         .text('Qty', 400, currentY)
         .text('Packed', 480, currentY);

      currentY += 20;

      // Table items
      order.items.forEach((item) => {
        const itemName = item.product?.name || 'Product';
        doc.text(itemName, 50, currentY, { width: 320 })
           .text(item.quantity.toString(), 400, currentY)
           .text('[ ]', 480, currentY); // Checkbox for packed items

        currentY += 25;
      });

      // Special instructions
      if (order.specialInstructions) {
        currentY += 30;
        doc.fontSize(12).text('Special Instructions:', 50, currentY);
        currentY += 20;
        doc.fontSize(10).text(order.specialInstructions, 50, currentY, { width: 500 });
      }

      // Signature section
      currentY += 80;
      doc.fontSize(12).text('Packed by: ________________________    Date: ____________', 50, currentY);

      doc.end();

    } catch (error) {
      console.error('Packing slip generation error:', error);
      reject(error);
    }
  });
};

/**
 * Generate shipping label PDF
 * @param {Object} order - Order object
 * @param {Object} fromAddress - Sender address
 * @returns {Buffer} PDF buffer
 */
const generateShippingLabelPDF = async (order, fromAddress = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 20, size: [400, 600] }); // Shipping label size
      const buffers = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      doc.on('error', reject);

      const defaultFromAddress = {
        name: 'Corporate Gifting Platform',
        street: '123 Business Ave',
        city: 'Business City',
        state: 'BC',
        zipCode: '12345',
        ...fromAddress
      };

      // From address
      doc.fontSize(10).text('FROM:', 20, 20);
      doc.fontSize(12)
         .text(defaultFromAddress.name, 20, 35)
         .text(defaultFromAddress.street, 20, 50)
         .text(`${defaultFromAddress.city}, ${defaultFromAddress.state} ${defaultFromAddress.zipCode}`, 20, 65);

      // To address (larger)
      doc.fontSize(10).text('TO:', 20, 120);
      doc.fontSize(16)
         .text(`${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`, 20, 140)
         .text(order.shippingAddress.street, 20, 165)
         .text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`, 20, 190)
         .text(order.shippingAddress.country, 20, 215);

      // Order information
      doc.fontSize(10)
         .text(`Order: ${order.orderNumber}`, 20, 270)
         .text(`Date: ${new Date().toLocaleDateString()}`, 20, 285);

      // Tracking number if available
      if (order.trackingNumber) {
        doc.fontSize(12).text(`Tracking: ${order.trackingNumber}`, 20, 310);
      }

      // Barcode placeholder (in real implementation, you'd use a barcode library)
      doc.rect(20, 350, 360, 60).stroke();
      doc.fontSize(8).text('Barcode Area', 180, 375, { align: 'center' });

      doc.end();

    } catch (error) {
      console.error('Shipping label generation error:', error);
      reject(error);
    }
  });
};

/**
 * Save PDF to file system
 * @param {Buffer} pdfBuffer - PDF buffer
 * @param {string} filename - Output filename
 * @param {string} directory - Output directory
 * @returns {string} File path
 */
const savePDFToFile = async (pdfBuffer, filename, directory = 'invoices') => {
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads', directory);
    
    // Ensure directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, pdfBuffer);
    
    return filePath;
  } catch (error) {
    console.error('Save PDF error:', error);
    throw error;
  }
};

/**
 * Generate and save invoice PDF
 * @param {Object} order - Order object
 * @param {Object} company - Company information
 * @returns {string} File path
 */
const generateAndSaveInvoice = async (order, company = {}) => {
  try {
    const pdfBuffer = await generateInvoicePDF(order, company);
    const filename = `invoice-${order.orderNumber}-${Date.now()}.pdf`;
    const filePath = await savePDFToFile(pdfBuffer, filename, 'invoices');
    
    return filePath;
  } catch (error) {
    console.error('Generate and save invoice error:', error);
    throw error;
  }
};

/**
 * Generate invoice and return as base64 string
 * @param {Object} order - Order object
 * @param {Object} company - Company information
 * @returns {string} Base64 encoded PDF
 */
const generateInvoiceBase64 = async (order, company = {}) => {
  try {
    const pdfBuffer = await generateInvoicePDF(order, company);
    return pdfBuffer.toString('base64');
  } catch (error) {
    console.error('Generate invoice base64 error:', error);
    throw error;
  }
};

module.exports = {
  generateInvoicePDF,
  generatePackingSlipPDF,
  generateShippingLabelPDF,
  savePDFToFile,
  generateAndSaveInvoice,
  generateInvoiceBase64
};