const FinalCta = require("../../model/SolutionsPage model/FinalCta");
const uploadImage = require("../../services/Storage.services");

// Get public Final CTA (active only)
async function getPublicFinalCta  (req, res){
  try {
    const finalCta = await FinalCta.findOne({ is_active: true });

    if (!finalCta) {
      return res.status(404).json({
        success: false,
        message: "No active Final CTA found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Final CTA retrieved successfully",
      data: finalCta,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving Final CTA",
      error: error.message,
    });
  }
};

// Create Final CTA (admin only)
async function createFinalCta (req, res){
  try {
    const { heading, highlighted_text, description, button_text, button_link, is_active } = req.body;

    // Validate required fields
    if (!heading || !description || !button_text || !button_link) {
      return res.status(400).json({
        success: false,
        message: "heading, description, button_text, and button_link are required",
      });
    }

    // Check if trying to create active CTA when one already exists
    if (is_active) {
      const existingActive = await FinalCta.findOne({ is_active: true });
      if (existingActive) {
        return res.status(400).json({
          success: false,
          message: "An active Final CTA already exists. Please deactivate it first.",
        });
      }
    }

    let background_image = "";

    // Handle image upload if file is provided
    if (req.file) {
      try {
        const response = await uploadImage(req.file.buffer, req.file.originalname, "SolutionsPage/FinalCta");
        background_image = response?.url;
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload image",
          error: uploadError.message,
        });
      }
    }

    const newFinalCta = new FinalCta({
      heading,
      highlighted_text: highlighted_text || "",
      description,
      button_text,
      button_link,
      background_image,
      is_active: is_active || false,
    });

    const savedFinalCta = await newFinalCta.save();

    res.status(201).json({
      success: true,
      message: "Final CTA created successfully",
      data: savedFinalCta,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating Final CTA",
      error: error.message,
    });
  }
};

// Get all Final CTAs (admin only)
async function getAllFinalCtas  (req, res) {
  try {
    const finalCtAs = await FinalCta.find().sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      message: "Final CTAs retrieved successfully",
      data: finalCtAs,
      total: finalCtAs.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving Final CTAs",
      error: error.message,
    });
  }
};

// Get Final CTA by ID (admin only)
async function getFinalCtaById  (req, res) {
  try {
    const { id } = req.params;

    const finalCta = await FinalCta.findById(id);

    if (!finalCta) {
      return res.status(404).json({
        success: false,
        message: "Final CTA not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Final CTA retrieved successfully",
      data: finalCta,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving Final CTA",
      error: error.message,
    });
  }
};

// Update Final CTA (admin only)
async function updateFinalCta  (req, res)  {
  try {
    const { id } = req.params;
    const { heading, highlighted_text, description, button_text, button_link, is_active } = req.body;

    const finalCta = await FinalCta.findById(id);

    if (!finalCta) {
      return res.status(404).json({
        success: false,
        message: "Final CTA not found",
      });
    }

    // Check if trying to activate when another is already active
    if (is_active && !finalCta.is_active) {
      const existingActive = await FinalCta.findOne({ is_active: true, _id: { $ne: id } });
      if (existingActive) {
        return res.status(400).json({
          success: false,
          message: "An active Final CTA already exists. Please deactivate it first.",
        });
      }
    }

    // Update text fields
    if (heading) finalCta.heading = heading;
    if (highlighted_text !== undefined) finalCta.highlighted_text = highlighted_text;
    if (description) finalCta.description = description;
    if (button_text) finalCta.button_text = button_text;
    if (button_link) finalCta.button_link = button_link;
    if (is_active !== undefined) finalCta.is_active = is_active;

    // Handle image upload if file is provided
    if (req.file) {
      try {
        const response = await uploadImage(req.file.buffer, req.file.originalname, "SolutionsPage/FinalCta");
        finalCta.background_image = response?.url;
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload image",
          error: uploadError.message,
        });
      }
    }

    const updatedFinalCta = await finalCta.save();

    res.status(200).json({
      success: true,
      message: "Final CTA updated successfully",
      data: updatedFinalCta,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating Final CTA",
      error: error.message,
    });
  }
};

// Delete Final CTA (admin only)
async function deleteFinalCta  (req, res) {
  try {
    const { id } = req.params;

    const finalCta = await FinalCta.findByIdAndDelete(id);

    if (!finalCta) {
      return res.status(404).json({
        success: false,
        message: "Final CTA not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Final CTA deleted successfully",
      data: finalCta,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting Final CTA",
      error: error.message,
    });
  }
};

module.exports= {
  getPublicFinalCta,
  createFinalCta,
  getAllFinalCtas,
  getFinalCtaById,
  updateFinalCta,
  deleteFinalCta
}
