const fs = require("fs");
const axios = require("axios");
const Tesseract = require("tesseract.js");

const image = "captcha.jpg";

const TextConverter = async (req, res) => {
  const imageUrl = req.body.url;
  axios({ method: "get", url: imageUrl, responseType: "stream" })
    .then((response) => {
      response.data.pipe(fs.createWriteStream(image)).on("close", () => {
        Tesseract.recognize(image, "eng", {
          logger: (m) => console.log(m),
        })
          .then(({ data: { text } }) => {
            res.status(200).json({ text, imageUrl });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ err });
          });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: "error", imageUrl, image });
    });
};

module.exports = { TextConverter };
