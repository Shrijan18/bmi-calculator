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
  } catch (err) {
    console.error("Error saving BMI:", err);
    alert("Failed to save BMI. Please try again.");
  }
});

// Handle search button
document.getElementById("searchBtn").addEventListener("click", () => {
  const name = document.getElementById("searchName").value.trim();
  if (name) loadHistory(name); // only fetch if a name is entered
});

// Load history (only when searched)
async function loadHistory(name = "") {
  try {
    const res = await fetch(`/history?name=${encodeURIComponent(name)}`);
    const history = await res.json();

    const tbody = document.querySelector("#historyTable tbody");
    tbody.innerHTML = "";

    history.forEach((row) => {
      const date = new Date(row.created_at).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
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
