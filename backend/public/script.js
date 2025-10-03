// Handle BMI form submit
document.getElementById("bmiForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const gender = document.getElementById("gender").value;
  const height = document.getElementById("height").value;
  const weight = document.getElementById("weight").value;

  try {
    const res = await fetch("/bmi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, age, gender, height, weight }),
    });

    const data = await res.json();

    document.getElementById("result").innerHTML = `
      <p><b>${data.name}</b> (${data.age}, ${data.gender})</p>
      <p>Height: ${data.height_cm} cm | Weight: ${data.weight_kg} kg</p>
      <p><b>BMI:</b> ${data.bmi} → <b>${data.category}</b></p>
    `;

    loadHistory(); // refresh history after new entry
  } catch (err) {
    console.error("Error saving BMI:", err);
    alert("Failed to save BMI. Please try again.");
  }
});

// Handle search button
document.getElementById("searchBtn").addEventListener("click", () => {
  const name = document.getElementById("searchName").value.trim();
  loadHistory(name);
});

// Load history (all or by search name)
async function loadHistory(name = "") {
  try {
    let url = "/history";
    if (name) url += `?name=${encodeURIComponent(name)}`;

    const res = await fetch(url);
    const history = await res.json();

    const tbody = document.querySelector("#historyTable tbody");
    tbody.innerHTML = "";

    history.forEach((row) => {
      const date = new Date(row.created_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${date}</td>
        <td>${row.name}</td>
        <td>${row.age}</td>
        <td>${row.gender}</td>
        <td>${row.height_cm}</td>
        <td>${row.weight_kg}</td>
        <td>${row.bmi}</td>
        <td>${row.category}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error fetching history:", err);
  }
}

// Load history on page load
loadHistory();
