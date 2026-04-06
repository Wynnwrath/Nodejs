const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
let db;

// 1. Point to your specific students.db file
(async () => {
    try {
        db = await open({
            filename: './students.db', // Updated filename
            driver: sqlite3.Database
        });
        console.log(" Connected to students.db");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
})();

// 2. GET Route: Fetch all students
app.get('/users', async (req, res) => {
    try {
        const data = await db.all('SELECT * FROM students ORDER BY lastname ASC');
        res.json(data);
    } catch (err) {
        console.error("Fetch Error:", err.message);
        res.status(500).json({ error: "Could not fetch data from students table." });
    }
});

// 3. POST Route: Add a student
app.post('/users', async (req, res) => {
    const { idno, lastname, firstname, course, level } = req.body;
    
    try {
        // Updated to match your exact schema
        const query = `
            INSERT INTO students (idno, lastname, firstname, course, level) 
            VALUES (?, ?, ?, ?, ?)
        `;
        await db.run(query, [idno, lastname, firstname, course, level]);
        res.json({ message: "Student added successfully!" });
    } catch (err) {
        console.error("Insert Error:", err.message);
        res.status(500).json({ error: "Failed to add student. Check column names." });
    }
});

app.get('/', (req, res) => res.send("Backend is Running on students.db!"));

app.listen(PORT, () => {
    console.log(`🚀 Server live at http://localhost:${PORT}`);
});
