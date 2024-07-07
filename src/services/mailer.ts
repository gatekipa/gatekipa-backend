import sgMail from "@sendgrid/mail";

export async function sendEmail(
  toEmail: string,
  subject: string,
  htmlContent: string
) {
  sgMail.setApiKey(process.env.SEND_GRID_API_KEY || "");

  const msg = {
    to: toEmail,
    from: process.env.SENDER_IDENTITY_EMAIL || "",
    subject: subject,
    html: htmlContent,
  };

  try {
    await sgMail.send({
      from: { email: process.env.SENDER_IDENTITY_EMAIL, name: "GateKipa" },
      ...msg,
    });
    console.log(`Email sent successfully to: ${toEmail}`);
  } catch (error) {
    console.error(`Error while sending email to ${toEmail}`, error);
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
}
