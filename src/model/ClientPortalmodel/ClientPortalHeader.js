const mongoose = require("mongoose");

const ClientPortalHeaderSchema = new mongoose.Schema(
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

const ClientPortalHeader = mongoose.model(
  "ClientPortalHeader",
  ClientPortalHeaderSchema
);

module.exports = ClientPortalHeader;
