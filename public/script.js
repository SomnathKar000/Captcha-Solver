// Get the DOM elements we'll be working with
const submitBtn = document.getElementById("submit");
const url = document.getElementById("url");
const loadingBox = document.getElementById("spinnerBox");
const inputBox = document.getElementById("inputBox");
const submitBtnBox = document.getElementById("submitBtnBox");
const outputBox = document.getElementById("outputBox");
const outputvalue = document.getElementById("outputvalue");
const solveAnother = document.getElementById("anotherCaptcha");

// When the submit button is clicked...
submitBtn.onclick = async () => {
  // Hide the input box and submit button, show the loading spinner
  inputBox.style.display = "none";
  submitBtnBox.style.display = "none";
  loadingBox.style.display = "block";
  let data = "";

  // Make a POST request to the /captcha endpoint with the URL entered by the user
  const response = await fetch("/captcha", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: url.value,
    }),
  });

  // Get the response data and hide the loading spinner
  data = await response.json();
  loadingBox.style.display = "none";

  // Set the output value to the response message and show the output box
  outputvalue.innerText = "Output : " + data.msg;
  outputBox.style.display = "block";
};

// When the "Solve Another" button is clicked...
solveAnother.onclick = () => {
  // Hide the output box and reset the URL input field
  outputBox.style.display = "none";
  url.value = "";

  // Show the input box and submit button again
  inputBox.style.display = "block";
  submitBtnBox.style.display = "block";
};
