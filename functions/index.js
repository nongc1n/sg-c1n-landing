const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const fetch = require("node-fetch");
const recaptchaUrl = "https://www.google.com/recaptcha/api/siteverify";

const recaptchaSecretKey = functions.config().config.recaptcha_secret_key;
const slackWebhookUrl = functions.config().config.slack_webhook_url;

const IncomingWebhook = require("@slack/client").IncomingWebhook;
const webhook = new IncomingWebhook(slackWebhookUrl);

function createMessage(data) {
  const { name, email, message } = data;
  let output = '';
  output += `********** *New contact request has been submitted* ********** \n`;
  output += `>*Name:* ${name}\n`;
  output += `>*Email:* ${email}\n`;
  output += `>*Message:* ${message}\n`;
  output += "****************************************************************";
  return output;
}

exports.submitRequest = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method === "POST") {
      const { data, verificationToken } = req.body;
      const keys = Object.keys(data);
      const validLength = keys.filter((key) => data[key]);

      if (!verificationToken || validLength < keys.length) {
        console.error("Validation error");
        res.status(400).end();
      } else {
        const response = await fetch(
          `${recaptchaUrl}?secret=${recaptchaSecretKey}&response=${verificationToken}`,
          {
            method: "POST",
          }
        );

        const obj = await response.json();

        if (response.ok) {
          const { success, score } = obj;

          if (success && score > 0.7) {
            const message = createMessage(data);

            webhook.send(message).then((result) => {
              if (result.text === "ok") {
                res.status(200).end();
              } else {
                console.error(`Unable to send: ${JSON.stringify(result)}`);
                res.status(400).end();
              }
            });
          } else {
            console.error("reCaptcha error", obj);
            res.status(400).end();
          }
        } else {
          console.error("reCaptcha fetch error", obj);
          res.status(400).end();
        }
      }
    } else {
      console.error("Method not allowed");
      res.status(405).end();
    }
  });
});
