import dotenv from "dotenv";
dotenv.config();

import twilio from "twilio";

const twilioConfig = {
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_ACCOUNT_AUTH_TOKEN,
  phoneNumber: process.env.TWILIO_ACCOUNT_PHONE_NUMBER,
};

const client = twilio(twilioConfig.accountSid, twilioConfig.authToken);

export async function sendSMS(to: string, message: string): Promise<Boolean> {
  try {
    const response = await client.messages.create({
      body: message,
      from: twilioConfig.phoneNumber,
      to,
    });
    console.debug("response :>> ", response);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
