// utils/brevoMailer.js
const SibApiV3Sdk = require('sib-api-v3-sdk');

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

/**
 * Sends OTP or other transactional emails
 * @param {string} toEmail Recipient email
 * @param {string} subject Email subject
 * @param {string} htmlContent HTML content of the email
 */
const sendEmail = async (toEmail, subject, htmlContent) => {
  try {
    await tranEmailApi.sendTransacEmail({
      sender: { email: "helpfromencryptedfilevault@gmail.com", name: "DeepShield" },
      to: [{ email: toEmail }],
      subject,
      htmlContent
    });
  } catch (err) {
    console.error("EMAIL SEND ERROR:", err.message);
    throw err;
  }
};

module.exports = sendEmail;