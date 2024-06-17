const express = require("express");
const path = require("path");
const cors = require("cors");
const { MailiskClient } = require("mailisk");
const { randomBytes } = require("crypto");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const PORT = 3001;

const NAMESPACE = process.env.MAILISK_NAMESPACE;

const mailisk = new MailiskClient({ apiKey: process.env.MAILISK_API_KEY });

// In a real application you would use something like redis to store verification codes
const codeStorage = {};

const userStorage = {
  "user@example.com": { password: "password", verified_email: true },
};

// We're using mailisk SMTP to send emails, but this could be substituted for any 3rd party email service
async function sendVerificationEmail(email) {
  // persist otp so it can be checked later
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  codeStorage[email] = code;


  // send email with code
  console.log("Sending verification email to", email, "with code", code);
  await mailisk.sendVirtualEmail(NAMESPACE, {
    from: "no-reply@example.com",
    to: email,
    subject: "Verify your email",
    html: `Your verification code is: <strong>${code}</strong>`,
  });
}

function createUser(email, password) {
  userStorage[email] = { password, verified_email: false };
}

const app = express();
app.use(express.json());
app.use(cors());

app.post("/register", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email) return res.status(400).send("No email provided");
  if (!password) return res.status(400).send("No password provided");

  if (userStorage[email]) return res.status(400).send("User already exists");

  createUser(email, password);

  try {
    await sendVerificationEmail(email);
  } catch (error) {
    console.error(error);
    return res.status(500).send("There was an error sending the email");
  }

  return res.sendStatus(200);
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email) return res.status(400).send("No email provided");
  if (!password) return res.status(400).send("No password provided");

  if (!userStorage[email]) return res.status(400).send("User not found");

  if (userStorage[email].password !== password) return res.status(400).send("Wrong password");

  // here we would set the session cookie or return a JWT
  // for brevity we're returning the verification status here, so FE can redirect as needed
  return res.json({
    email,
    verified_email: userStorage[email].verified_email,
  });
});

app.post("/verify-email", async (req, res) => {
  console.log("received /verify-email with data:", req.body);

  const code = req.body.code;
  const email = req.body.email;
  if (!code) return res.status(400).send("No code provided");
  if (!email) return res.status(400).send("No email provided");

  if (!codeStorage[email]) return res.status(400).send("No pending email verification for " + email);
  else if (codeStorage[email] !== code) return res.status(400).send("Wrong verification code");

  // mark the user as having a verified email
  userStorage[email].verified_email = true;

  // erase code so it cannot be used again
  delete codeStorage[email];

  return res.sendStatus(200);
});

app.listen(PORT, () => console.log(`Started listening on port ${PORT}`));
