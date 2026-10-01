const { isValidObjectId } = require("mongoose");
const BookDemoForm = require("../../model/BookDemoPagemodel/BookDemoForm.model");

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

const ALLOWED_FIRM_SIZES = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-1000 employees",
  "1000+ employees",
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
    if (!ALLOWED_FIRM_SIZES.includes(req.body.firmSize)) {
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
      firmSize: req.body.firmSize,
      preferredDate: req.body.preferredDate || null,
      preferredTime: req.body.preferredTime ? normalizeText(req.body.preferredTime) : "",
      message: normalizeText(req.body.message),
      status: "New",
    });

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
