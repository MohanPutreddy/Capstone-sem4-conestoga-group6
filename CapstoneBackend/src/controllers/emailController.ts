import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");
const FROM_MAIL = process.env.SENDGRID_FROM_MAIL;

export const sendEmail = async (
  mail: string,
  subject: string,
  text: string
) => {
  const msg = {
    to: mail,
    from: FROM_MAIL || "",
    subject,
    text,
  };
  const response = await sgMail.send(msg);
  return response;
};
