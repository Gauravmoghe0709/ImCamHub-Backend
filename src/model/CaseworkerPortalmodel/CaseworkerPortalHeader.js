const mongoose = require("mongoose");

const CaseworkerPortalHeaderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const CaseworkerPortalHeader = mongoose.model(
  "CaseworkerPortalHeader",
  CaseworkerPortalHeaderSchema
);

module.exports = CaseworkerPortalHeader;
