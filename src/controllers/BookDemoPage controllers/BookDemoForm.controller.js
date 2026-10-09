const { isValidObjectId } = require("mongoose");
const fs = require("fs");
const path = require("path");
const BookDemoForm = require("../../model/BookDemoPagemodel/BookDemoForm.model");
const sendEmail = require("../../../mailer");

const normalizeText = (value) => (typeof value === "string" ? value.trim() : value);

const sanitizeBookDemoForm = (record) => {
  if (!record) return null;

  return {
    _id: record._id,
    firmName: record.firmName || "",
    fullName: record.fullName || "",
    workEmail: record.workEmail || "",
    phoneNumber: record.phoneNumber || "",
    firmSize: record.firmSize || "",
    preferredDate: record.preferredDate || null,
    preferredTime: record.preferredTime || "",
    message: record.message || "",
    status: record.status || "New",
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
};

const validateRequiredFields = (payload, fields) => {
  for (const field of fields) {
    if (payload[field] === undefined || payload[field] === null || String(payload[field]).trim() === "") {
      return field;
    }
  }
  return null;
};

// Helper function to escape HTML special characters for safe email rendering
const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

// Helper function to extract first name from full name
const getFirstName = (fullName = "") => {
  const name = String(fullName).trim();
  const parts = name.split(/\s+/);
  return parts.length > 0 ? parts[0] : "";
};

// Helper function to load and populate the confirmation email template
const generateConfirmationEmail = (enquiry) => {
  try {
    const templatePath = path.join(__dirname, "../../templates/BookDemoConfirmation.html");
    let htmlTemplate = fs.readFileSync(templatePath, "utf8");

    // Extract first name from full name
    const firstName = getFirstName(enquiry.fullName);

    // Format date and time
    const dateStr = enquiry.preferredDate
      ? new Date(enquiry.preferredDate).toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "To be confirmed by our team";

    const timeStr = enquiry.preferredTime ? enquiry.preferredTime : "To be confirmed by our team";

    // Determine meeting details
    const meetingDetails =
      enquiry.preferredDate || enquiry.preferredTime
        ? "To be confirmed by our team"
        : "To be confirmed by our team";

    // Replace placeholders with escaped values
    const populatedHtml = htmlTemplate
      .replace(/{{firstName}}/g, escapeHtml(firstName))
      .replace(/{{companyName}}/g, escapeHtml(enquiry.firmName))
      .replace(/{{preferredDate}}/g, escapeHtml(dateStr))
      .replace(/{{preferredTime}}/g, escapeHtml(timeStr))
      .replace(/{{meetingDetails}}/g, escapeHtml(meetingDetails));

    return populatedHtml;
  } catch (error) {
    console.error("Error loading confirmation email template:", error);
    throw error;
  }
};

// Generate plain text email content
const generatePlainTextEmail = (enquiry) => {
  const dateStr = enquiry.preferredDate ? new Date(enquiry.preferredDate).toLocaleDateString() : "Not specified";
  return `New Book Demo Enquiry

Firm / Company Name: ${enquiry.firmName}
Full Name: ${enquiry.fullName}
Work Email: ${enquiry.workEmail}
Phone Number: ${enquiry.phoneNumber}
Firm Size: ${enquiry.firmSize}
Preferred Date: ${dateStr}
Preferred Time: ${enquiry.preferredTime || "Not specified"}

Message / Notes:
${enquiry.message}

---
This is an automated notification from ImCamHub`;
};

// Generate professional HTML email template
const generateHtmlEmail = (enquiry) => {
  const dateStr = enquiry.preferredDate ? new Date(enquiry.preferredDate).toLocaleDateString() : "Not specified";
  const escapedFullName = escapeHtml(enquiry.fullName);
  const escapedFirmName = escapeHtml(enquiry.firmName);
  const escapedEmail = escapeHtml(enquiry.workEmail);
  const escapedPhone = escapeHtml(enquiry.phoneNumber);
  const escapedFirmSize = escapeHtml(enquiry.firmSize);
  const escapedDate = escapeHtml(dateStr);
  const escapedTime = escapeHtml(enquiry.preferredTime || "Not specified");
  const escapedMessage = escapeHtml(enquiry.message);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Book Demo Enquiry</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
        
        <!-- Header with Gradient -->
        <div style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 40px 20px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 700;">ImCamHub</h1>
          <p style="margin: 8px 0 0 0; font-size: 16px; font-weight: 500; opacity: 0.95;">New Book Demo Enquiry</p>
        </div>

        <!-- Main Content -->
        <div style="padding: 40px 30px;">
          
          <!-- Introduction -->
          <h2 style="margin: 0 0 30px 0; font-size: 20px; color: #111827; font-weight: 600;">📋 New Enquiry Received</h2>
          
          <!-- Key Information Section -->
          <div style="background-color: #f3f4f6; padding: 24px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #4F46E5;">
            
            <!-- Full Name (Prominent) -->
            <div style="margin-bottom: 20px;">
              <p style="margin: 0; font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">👤 Full Name</p>
              <p style="margin: 6px 0 0 0; font-size: 18px; color: #111827; font-weight: 700;">${escapedFullName}</p>
            </div>

            <!-- Firm Name -->
            <div style="margin-bottom: 20px;">
              <p style="margin: 0; font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">🏢 Firm / Company</p>
              <p style="margin: 6px 0 0 0; font-size: 16px; color: #374151;">${escapedFirmName}</p>
            </div>

            <!-- Work Email -->
            <div style="margin-bottom: 20px;">
              <p style="margin: 0; font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">✉️ Work Email</p>
              <p style="margin: 6px 0 0 0; font-size: 16px; color: #374151;"><a href="mailto:${escapedEmail}" style="color: #4F46E5; text-decoration: none;">${escapedEmail}</a></p>
            </div>

            <!-- Phone Number -->
            <div style="margin-bottom: 20px;">
              <p style="margin: 0; font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">📞 Phone Number</p>
              <p style="margin: 6px 0 0 0; font-size: 16px; color: #374151;"><a href="tel:${escapedPhone}" style="color: #4F46E5; text-decoration: none;">${escapedPhone}</a></p>
            </div>

            <!-- Firm Size -->
            <div style="margin-bottom: 20px;">
              <p style="margin: 0; font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">👥 Firm Size</p>
              <p style="margin: 6px 0 0 0; font-size: 16px; color: #374151;">${escapedFirmSize}</p>
            </div>

            <!-- Preferred Date -->
            <div style="margin-bottom: 20px;">
              <p style="margin: 0; font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">📅 Preferred Date</p>
              <p style="margin: 6px 0 0 0; font-size: 16px; color: #374151;">${escapedDate}</p>
            </div>

            <!-- Preferred Time -->
            <div>
              <p style="margin: 0; font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">🕐 Preferred Time</p>
              <p style="margin: 6px 0 0 0; font-size: 16px; color: #374151;">${escapedTime}</p>
            </div>

          </div>

          <!-- Message Section (Prominent) -->
          <div style="background-color: #FEF3F2; padding: 24px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #7C3AED;">
            <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">💬 Message / Notes</p>
            <p style="margin: 0; font-size: 15px; color: #374151; line-height: 1.6; white-space: pre-wrap;">${escapedMessage}</p>
          </div>

          <!-- Success Indicator -->
          <div style="background-color: #ECFDF5; padding: 16px; border-radius: 8px; text-align: center; margin-bottom: 20px; border: 1px solid #D1FAE5;">
            <p style="margin: 0; font-size: 14px; color: #059669; font-weight: 600;">✓ New enquiry received and logged</p>
          </div>

        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; font-size: 12px; color: #6b7280;">
            <strong>ImCamHub</strong><br>
            Automated enquiry notification system
          </p>
          <p style="margin: 12px 0 0 0; font-size: 11px; color: #9ca3af;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>

      </div>
    </body>
    </html>
  `;
};

const ALLOWED_FIRM_SIZES = [
  "1 - 10 employees",
  "11 - 50 employees",
  "51 - 200 employees",
  "201 - 1,000 employees",
  "1,000+ employees",
];

const ALLOWED_STATUSES = ["New", "Contacted", "Scheduled", "Completed", "Cancelled"];


async function createBookDemoForm(req, res) {
  try {
    const requiredFields = ["firmName", "fullName", "workEmail", "phoneNumber", "firmSize", "message"];

    const missingField = validateRequiredFields(req.body, requiredFields);

    if (missingField) {
      return res.status(400).json({
        success: false,
        message: `${missingField} is required`,
      });
    }

    // Validate firmSize
    if (!ALLOWED_FIRM_SIZES.includes(normalizeText(req.body.firmSize))) {
      return res.status(400).json({
        success: false,
        message: "Invalid firm size. Please select from the allowed options.",
      });
    }

    const bookDemoForm = await BookDemoForm.create({
      firmName: normalizeText(req.body.firmName),
      fullName: normalizeText(req.body.fullName),
      workEmail: normalizeText(req.body.workEmail).toLowerCase(),
      phoneNumber: normalizeText(req.body.phoneNumber),
      firmSize: normalizeText(req.body.firmSize),
      preferredDate: req.body.preferredDate || null,
      preferredTime: req.body.preferredTime ? normalizeText(req.body.preferredTime) : "",
      message: normalizeText(req.body.message),
      status: "New",
    });

    // Send notification email to admin AFTER successful database save
    try {
      const adminEmail = process.env.ADMIN_EMAIL || "gauravmoghe930@gmail.com";
      const emailSubject = `New Book Demo Enquiry - ${escapeHtml(bookDemoForm.firmName)}`;
      const plainTextEmail = generatePlainTextEmail(bookDemoForm);
      const htmlEmail = generateHtmlEmail(bookDemoForm);

      await sendEmail(adminEmail, emailSubject, plainTextEmail, htmlEmail);
    } catch (emailError) {
      // Log email error but do NOT fail the enquiry submission
      console.error("Failed to send enquiry notification email:", emailError);
      // Enquiry is already saved in database, so this is non-critical
    }

    // Send confirmation email to user AFTER successful database save
    try {
      const confirmationSubject = "Demo Confirmation - ImCam Hub";
      const confirmationHtml = generateConfirmationEmail(bookDemoForm);
      
      // Generate plain text version for fallback
      const plainTextConfirmation = `
Hi ${getFirstName(bookDemoForm.fullName)},

Thank you for your interest in ImCam Hub!

We've received your demo request for ${bookDemoForm.firmName}.

Demo Meeting: ${bookDemoForm.firmName}
Date: ${bookDemoForm.preferredDate ? new Date(bookDemoForm.preferredDate).toLocaleDateString() : "To be confirmed"}
Time: ${bookDemoForm.preferredTime || "To be confirmed"}

Our team will contact you shortly to confirm the meeting details.

Speak soon!
Best regards,
Team ImCam Hub
      `.trim();

      await sendEmail(bookDemoForm.workEmail, confirmationSubject, plainTextConfirmation, confirmationHtml);
    } catch (emailError) {
      // Log email error but do NOT fail the enquiry submission
      console.error("Failed to send user confirmation email:", emailError);
      // Enquiry is already saved in database, so this is non-critical
    }

    return res.status(201).json({
      success: true,
      message: "Book demo submitted successfully.",
      data: sanitizeBookDemoForm(bookDemoForm),
    });
  } catch (error) {
    console.error("Error creating book demo form:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

async function getAllBookDemosForm(req, res) {
  try {
    const bookDemos = await BookDemoForm.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookDemos.length,
      data: bookDemos.map(sanitizeBookDemoForm),
    });
  } catch (error) {
    console.error("Error fetching book demos:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

async function getBookDemoFormById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book demo ID",
      });
    }

    const bookDemo = await BookDemoForm.findById(id);

    if (!bookDemo) {
      return res.status(404).json({
        success: false,
        message: "Book demo enquiry not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: sanitizeBookDemoForm(bookDemo),
    });
  } catch (error) {
    console.error("Error fetching book demo:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}
async function updateBookDemoFormStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book demo ID",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${ALLOWED_STATUSES.join(", ")}`,
      });
    }

    const bookDemo = await BookDemoForm.findById(id);

    if (!bookDemo) {
      return res.status(404).json({
        success: false,
        message: "Book demo enquiry not found.",
      });
    }

    bookDemo.status = status;
    await bookDemo.save();

    return res.status(200).json({
      success: true,
      message: "Book demo status updated successfully.",
      data: sanitizeBookDemoForm(bookDemo),
    });
  } catch (error) {
    console.error("Error updating book demo status:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}
async function deleteBookDemoForm(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book demo ID",
      });
    }

    const bookDemo = await BookDemoForm.findByIdAndDelete(id);

    if (!bookDemo) {
      return res.status(404).json({
        success: false,
        message: "Book demo enquiry not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Book demo enquiry deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting book demo:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

module.exports = {
  createBookDemoForm,
  getAllBookDemosForm,
  getBookDemoFormById,
  updateBookDemoFormStatus,
  deleteBookDemoForm,
};
