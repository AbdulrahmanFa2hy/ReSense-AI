document.getElementById("start-streamlit-btn").addEventListener("click", () => {
  fetch("/start-streamlit")
    .then((response) => response.text())
    .then((data) => {
      console.log(data);
      alert("Streamlit server started!");
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Failed to start Streamlit server.");
    });
});

document
  .getElementById("start-streamlit-btn")
  .addEventListener("mouseover", () => {
    document.getElementById("start-streamlit-btn").style.backgroundColor =
      "#0056b3";
  });

document
  .getElementById("start-streamlit-btn")
  .addEventListener("mouseout", () => {
    document.getElementById("start-streamlit-btn").style.backgroundColor =
      "#007bff";
  });
