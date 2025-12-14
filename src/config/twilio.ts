// Download the helper library from https://www.twilio.com/docs/node/install
 // Or, for ESM: import twilio from "twilio";

import twilio from "twilio";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
export const twilioClient = twilio(accountSid, authToken);
