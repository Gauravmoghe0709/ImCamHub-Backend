const mongoose = require("mongoose");

const ClientPortalDailyWorkflowSchema = new mongoose.Schema(
  {
    badge_text: {
      type: String,
      required: true,
      trim: true,
    },
    heading: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    secondary_description: {
      type: String,
      required: true,
      trim: true,
    },
    features: {
      type: [String],
      required: true,
      default: [],
    },
    section_image: {
      type: String,
      required: true,
    },
    is_active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const ClientPortalDailyWorkflow = mongoose.model(
  "ClientPortalDailyWorkflow",
  ClientPortalDailyWorkflowSchema
);

module.exports = ClientPortalDailyWorkflow;
