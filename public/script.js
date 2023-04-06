const submitBtn = document.getElementById("submit");
const url = document.getElementById("url").value;

submitBtn.onclick = async () => {
  try {
    const response = await fetch("http://localhost:5000/captcha", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: url,
      }),
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};
