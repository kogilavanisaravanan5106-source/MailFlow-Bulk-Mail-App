
const express = require("express");
const router = express.Router();

const {
  sendCampaign,
  getCampaignHistory,
} = require("../controllers/emailController");

router.post("/campaigns/send", sendCampaign);
router.get("/campaigns/history", getCampaignHistory);

module.exports = router;

