const Campaign = require("../models/Campaign");

require("dotenv").config();
const nodemailer = require("nodemailer");

const sendCampaign = async (req, res) => {
  try {
    const { recipients, subject, body } = req.body;

    // Validate required fields
    if (
      !Array.isArray(recipients) ||
      recipients.length === 0 ||
      !subject?.trim() ||
      !body?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Recipients, subject, and message are required.",
      });
    }

    // Validate email addresses
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanedRecipients = recipients.map((email) =>
      typeof email === "string" ? email.trim() : ""
    );

    if (
      cleanedRecipients.some(
        (email) => !emailPattern.test(email)
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "One or more recipient email addresses are invalid.",
      });
    }

    // Check Mailtrap configuration
    if (
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      return res.status(500).json({
        success: false,
        message: "Mailtrap credentials are missing in .env.",
      });
    }

    // Connect to Mailtrap
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 2525),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send the campaign email
    const info = await transporter.sendMail({
      from:
        process.env.MAIL_FROM ||
        '"Bulk Mail App" <no-reply@example.com>',
      to: process.env.MAIL_FROM || "no-reply@example.com",
      bcc: cleanedRecipients,
      subject: subject.trim(),
      text: body.trim(),
    });

    
await Campaign.create({
  recipients: cleanedRecipients,
  subject: subject.trim(),
  body: body.trim(),
  recipientCount: cleanedRecipients.length,
  status: "Sent",
});


    console.log("Mailtrap accepted message:", info.messageId);

    return res.status(200).json({
      success: true,
      message: "Email campaign sent to Mailtrap successfully!",
      messageId: info.messageId,
      recipientCount: cleanedRecipients.length,
    });
  } catch (error) {
    console.error("Campaign error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to send the email campaign. Check your SMTP configuration.",
    });
  }
};


const getCampaignHistory = async (req, res) => {
  try {
    const campaigns = await Campaign.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      campaigns,
    });
  } catch (error) {
    console.error("Campaign history error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch campaign history.",
    });
  }
};


module.exports = { sendCampaign, getCampaignHistory };