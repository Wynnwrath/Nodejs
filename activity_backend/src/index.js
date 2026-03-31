const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

let db;

const militaryNames = [
  "Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", 
  "Hotel", "India", "Juliett", "Kilo", "Lima", "Mike", "November", 
  "Oscar", "Papa", "Quebec", "Romeo", "Sierra", "Tango", "Uniform", 
  "Victor", "Whiskey", "X-ray", "Yankee", "Zulu"
];

// Initialize Database and Seed Data
(async () => {
    db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user TEXT
        )
    `);

    const count = await db.get('SELECT COUNT(*) as count FROM users');
    
    if (count.count === 0) {
        console.log("Seeding military names into database...");
        for (const name of militaryNames) {
            await db.run('INSERT INTO users (user) VALUES (?)', [name]);
        }
        console.log("Database seeded successfully!");
    }
})();

// API Route to fetch all users
app.get('/users', async (req, res) => {
    try {
        const users = await db.all('SELECT * FROM users ORDER BY user ASC');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// Health check
app.get('/', (req, res) => res.send("Backend is Running!"));

app.listen(PORT, () => console.log(`Server live on port ${PORT}`));