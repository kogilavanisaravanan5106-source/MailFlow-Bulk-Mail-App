
const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    recipients: {
      type: [String],
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    recipientCount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "Sent",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Campaign", campaignSchema);
