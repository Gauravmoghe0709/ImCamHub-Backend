const { isValidObjectId } = require("mongoose");
const BookDemoPage = require("../../model/BookDemoPagemodel/BookDemoPage.model");

const normalizeText = (value) => (typeof value === "string" ? value.trim() : value);

const sanitizeBookDemoPage = (record) => {
  if (!record) return null;

  return {
    _id: record._id,
    badgeText: record.badgeText || "",
    title: record.title || "",
    description: record.description || "",
    isActive: record.isActive,
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

async function createBookDemoPage(req, res) {
  try {
    const requiredFields = ["title", "description"];

    const missingField = validateRequiredFields(req.body, requiredFields);

    if (missingField) {
      return res.status(400).json({
        success: false,
        message: `${missingField} is required`,
      });
    }

    const bookDemoPage = await BookDemoPage.create({
      badgeText: normalizeText(req.body.badgeText) || "",
      title: normalizeText(req.body.title),
      description: normalizeText(req.body.description),
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    });

    return res.status(201).json({
      success: true,
      message: "Book Demo Page created successfully",
      data: sanitizeBookDemoPage(bookDemoPage),
    });
  } catch (error) {
    console.error("Error creating Book Demo Page:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

async function getBookDemoPageAdmin(req, res) {
  try {
    const bookDemoPage = await BookDemoPage.findOne().sort({ createdAt: -1 });

    if (!bookDemoPage) {
      return res.status(404).json({
        success: false,
        message: "Book Demo Page not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Book Demo Page fetched successfully",
      data: sanitizeBookDemoPage(bookDemoPage),
    });
  } catch (error) {
    console.error("Error fetching Book Demo Page:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

async function updateBookDemoPage(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Book Demo Page ID",
      });
    }

    const existingBookDemoPage = await BookDemoPage.findById(id);

    if (!existingBookDemoPage) {
      return res.status(404).json({
        success: false,
        message: "Book Demo Page not found",
      });
    }

    const updatePayload = {};

    const textFields = ["badgeText", "title", "description"];

    textFields.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== null) {
        updatePayload[field] = normalizeText(req.body[field]);
      }
    });

    // Handle boolean field
    if (req.body.isActive !== undefined) {
      updatePayload.isActive = req.body.isActive;
    }

    const updatedBookDemoPage = await BookDemoPage.findByIdAndUpdate(
      id,
      updatePayload,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Book Demo Page updated successfully",
      data: sanitizeBookDemoPage(updatedBookDemoPage),
    });
  } catch (error) {
    console.error("Error updating Book Demo Page:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

async function deleteBookDemoPage(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Book Demo Page ID",
      });
    }

    const bookDemoPage = await BookDemoPage.findByIdAndDelete(id);

    if (!bookDemoPage) {
      return res.status(404).json({
        success: false,
        message: "Book Demo Page not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Book Demo Page deleted successfully",
      data: sanitizeBookDemoPage(bookDemoPage),
    });
  } catch (error) {
    console.error("Error deleting Book Demo Page:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}
async function getPublicBookDemoPage(req, res) {
  try {
    const bookDemoPage = await BookDemoPage.findOne({ isActive: true }).sort({
      updatedAt: -1,
      createdAt: -1,
    });

    if (!bookDemoPage) {
      return res.status(404).json({
        success: false,
        message: "Book Demo Page not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      data: sanitizeBookDemoPage(bookDemoPage),
    });
  } catch (error) {
    console.error("Error fetching public Book Demo Page:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

module.exports = {
  createBookDemoPage,
  getBookDemoPageAdmin,
  updateBookDemoPage,
  deleteBookDemoPage,
  getPublicBookDemoPage,
};
