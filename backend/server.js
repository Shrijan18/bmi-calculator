import express from "express";
import cors from "cors";
import pool from "./db.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve frontend static files
app.use(express.static(path.join(__dirname, "public")));

// Create table if not exists
pool.query(`
  CREATE TABLE IF NOT EXISTS bmi_records (
    id SERIAL PRIMARY KEY,
    name TEXT,
    age INT,
    gender TEXT,
    height_cm FLOAT,
    weight_kg FLOAT,
    bmi FLOAT,
    category TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  )
`);

// API to save BMI record
app.post("/bmi", async (req, res) => {
  try {
    const { name, age, gender, height, weight } = req.body;
    const bmi = (weight / ((height / 100) ** 2)).toFixed(2);

    let category = "";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 25) category = "Normal";
    else if (bmi < 30) category = "Overweight";
    else category = "Obese";

    const result = await pool.query(
      `INSERT INTO bmi_records (name, age, gender, height_cm, weight_kg, bmi, category) 
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [name, age, gender, height, weight, bmi, category]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// API to get BMI history (all or by name)
app.get("/history", async (req, res) => {
  try {
    const { name } = req.query;

    let result;
    if (name) {
      result = await pool.query(
        `SELECT * FROM bmi_records 
         WHERE LOWER(name) LIKE LOWER($1) 
         ORDER BY created_at DESC`,
        [`%${name}%`]
      );
    } else {
      result = await pool.query(
        `SELECT * FROM bmi_records ORDER BY created_at DESC`
      );
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ✅ Catch-all → serve index.html for frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
