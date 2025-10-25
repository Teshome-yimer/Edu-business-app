// Import modules
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

// Create Express app
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root", // your MySQL username
    password: "", // your MySQL password
    database: "edu_business" // your database name
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error("MySQL connection error:", err);
    } else {
        console.log("✅ Connected to MySQL database!");
    }
});

// Test route
app.get("/", (req, res) => {
    res.send("<h1>Welcome to Edu-Business App Server developed by teshome this is the first server!</h1><p>Server is live! now ready to acess backend</p>!");
});

// Get all users
app.get("/users", (req, res) => {
    const sql = "SELECT id, name, email FROM users"; // fetch sample users
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching users:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

// Optional: Add new user dynamically
app.post("/users", (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, password], (err, result) => {
        if (err) {
            console.error("Error inserting user:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ message: "User added successfully!", userId: result.insertId });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});