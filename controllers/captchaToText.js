const fs = require("fs");
const axios = require("axios");
const Tesseract = require("tesseract.js");
const { createCanvas, loadImage, ImageData } = require("canvas");
const { createWorker } = require("node-tesseract-ocr");

const image = "captcha.jpg";

const TextConverter1 = async (req, res) => {
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
              res.status(200).json(result.data.text);
            })
            .catch((err) => {
              console.log("Error solving captcha:", err);
              res.status(500).json(err);
            });
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: "error", imageUrl, image });
    });
};

const TextConverter = async (req, res) => {
  const imageUrl = req.body.url;

  axios({
    method: "get",
    url: imageUrl,
    responseType: "stream",
  })
    .then((response) => {
      const image = "captcha.png";

      response.data.pipe(fs.createWriteStream(image)).on("close", async () => {
        console.log("Image downloaded successfully");

        try {
          // Step 2: Use Tesseract.js to recognize the captcha text
          const worker = createWorker();
          await worker.load();
          await worker.loadLanguage("eng");
          await worker.initialize("eng");
          const {
            data: { text },
          } = await worker.recognize(image);
          console.log("Solved captcha:", text);
          await worker.terminate();
          res.status(200).json(text);
        } catch (err) {
          console.log("Error solving captcha:", err);
          res.status(500).json(err);
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: "error", imageUrl, image });
    });
};

module.exports = { TextConverter };
