const express = require("express");
const { TextConverter } = require("./controllers/captchaToText");

const app = express();
const port = 5000;

app.use(express.json());

app.use(express.static("./public"));

app.get("/", (req, res) => {
  res.send("ok");
});

app.post("/captcha", TextConverter);

app.listen(port, () => {
  console.log("listening on port " + port);
});
