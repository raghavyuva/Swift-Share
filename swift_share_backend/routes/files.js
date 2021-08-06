const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const File = require("../models/file");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.MAIL_KEY,
    },
  })
);

let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

let upload = multer({ storage, limits: { fileSize: 1000000 * 100 } }).single(
  "myfile"
); //100mb

router.post("/", (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    const file = new File({
      filename: req.file.filename,
      uuid: uuidv4(),
      path: req.file.path,
      size: req.file.size,
    });
    const response = await file.save();
    res.json({
      file: `${process.env.CLIENT_URL}/download_file/${response.uuid}`,
      uuid: response.uuid,
    });
  });
});

router.post("/send", async (req, res) => {
  const { uuid, emailTo, emailFrom, expiresIn } = req.body;
  console.log(req.body.uuid);
  if (!uuid || !emailTo || !emailFrom) {
    return res
      .status(422)
      .send({ error: "All fields are required except expiry." });
  }
  try {
    const file = await File.findOne({ uuid: uuid });
    if (file.sender) {
      return res.status(422).send({ error: "Email already sent once." });
    }
    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();
    transporter
      .sendMail({
        to: emailTo,
        from: "me@raghavyuva.com",
        subject: `${emailFrom} sent you a file through Swift Share.`,
        text: `${emailFrom} shared a file with you.`,
        html: `
          <!DOCTYPE html>
          <html>
              <body>
            <h1>Swift Share</h1>
            <p>your friend has sent you this file</p>
             expires: "24 hours",
              <a href="${process.env.CLIENT_URL}/download_file/${file.uuid}">
              click here tco download the file
              </a>
            </body>
            </html>
            `,
      })
      .then((es) => {
        res.send({
          message: "check your email",
        });
      });
  } catch (err) {
    return res.status(500).send({ error: "Something went wrong." });
  }
});

module.exports = router;