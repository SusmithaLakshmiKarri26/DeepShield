import SibApiV3Sdk from "sib-api-v3-sdk";

const client = SibApiV3Sdk.ApiClient.instance;

const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

export const sendEmail = async (to, subject, html) => {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const email = {
    sender: {
      email: "infofromefv@gmail.com",
      name: "Encrypted File Vault"
    },
    to: [{ email: to }],
    subject: subject,
    htmlContent: html
  };

  await apiInstance.sendTransacEmail(email);
};