const API_URL = "http://localhost:5000";

document.getElementById("bmiForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const gender = document.getElementById("gender").value;
  const height = document.getElementById("height").value;
  const weight = document.getElementById("weight").value;

  const res = await fetch(`${API_URL}/bmi`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, age, gender, height, weight }),
  });

  const data = await res.json();
  document.getElementById("result").innerHTML =
    `Your BMI: <strong>${data.bmi}</strong> (${data.category})`;

  // ✅ Refresh history after adding a record
  fetchHistory();
});

async function fetchHistory(searchName = "") {
  let url = `${API_URL}/history`;
  if (searchName) {
    url += `?name=${encodeURIComponent(searchName)}`;
  }

  try {
    const res = await fetch(url);
    const records = await res.json();

    const tbody = document.querySelector("#historyTable tbody");
    tbody.innerHTML = "";

    records.forEach(r => {
      const date = new Date(r.created_at);

      // ✅ Format like: 3 October 2025, 8:59 PM
      const formattedDate = date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
      const formattedTime = date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });

      const row = `<tr>
        <td>${formattedDate}, ${formattedTime}</td>
        <td>${r.name}</td>
        <td>${r.age}</td>
        <td>${r.gender}</td>
        <td>${r.height_cm}</td>
        <td>${r.weight_kg}</td>
        <td>${r.bmi}</td>
        <td>${r.category}</td>
      </tr>`;
      tbody.innerHTML += row;
    });
  } catch (err) {
    console.error("Error loading history:", err);
  }
}

// ✅ Load history automatically on page load
window.onload = () => {
  fetchHistory();

  // search button event
  document.getElementById("searchBtn").addEventListener("click", () => {
    const searchName = document.getElementById("searchName").value;
    fetchHistory(searchName);
  });
};
