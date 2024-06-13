import nodemailer from "nodemailer";

export async function sendEmail(
  toEmail: string,
  subject: string,
  html: string
) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.FROM_EMAIL,
      pass: process.env.FROM_EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.FROM_EMAIL_ADDRESS,
    to: toEmail,
    subject: subject,
    text: html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to: ${toEmail}`, info);
  } catch (error) {
    console.error(`Error while sending email to ${mailOptions.to}`, error);
  }
}
