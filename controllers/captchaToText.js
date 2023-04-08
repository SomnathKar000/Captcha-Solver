const fs = require("fs");
const axios = require("axios");
const Tesseract = require("tesseract.js");
const { createCanvas, loadImage } = require("canvas");

const image = "captcha.jpg";

const TextConverter = async (req, res) => {
  const imageUrl = req.body.url;
  axios({ method: "get", url: imageUrl, responseType: "stream" })
    .then((response) => {
      response.data.pipe(fs.createWriteStream(image)).on("close", () => {
        console.log("Image downloaded successfully");
        // Step 2: Load the image using canvas and extract the captcha image
        loadImage(image).then((image) => {
          const canvas = createCanvas(image.width, image.height);
          const context = canvas.getContext("2d");

          // Draw the image onto the canvas context

          context.drawImage(image, 0, 0, image.width, image.height);
          const captcha = canvas.toDataURL("image/png");

          // Step 3: Use Tesseract.js to recognize the captcha text
          Tesseract.recognize(captcha)
            .then((result) => {
              console.log("Solved captcha:");
              res
                .status(200)
                .json({ success: true, msg: result.data.text.trim() });
            })
            .catch((err) => {
              console.log("Error solving captcha:", err);
              res
                .status(500)
                .json({ success: false, msg: "Error solving captcha" });
            });
        });
      });
    })
    .catch((err) => {
      res.status(500).json({ success: false, msg: "Not a valid url" });
    });
};

module.exports = { TextConverter };
