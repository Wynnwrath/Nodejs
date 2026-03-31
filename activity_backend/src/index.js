const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const app = express();
app.use(cors());
app.use(express.json());

let db;

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

    // Seed data if empty
    const count = await db.get('SELECT COUNT(*) as count FROM users');
    if (count.count === 0) {
        await db.run('INSERT INTO users (user) VALUES (?)', ['JohnDoe123']);
        await db.run('INSERT INTO users (user) VALUES (?)', ['SethPinca_Dev']);
        await db.run('INSERT INTO users (user) VALUES (?)', ['Jane_Smith']);
    }
})();

app.get('/users', async (req, res) => {
    const users = await db.all('SELECT * FROM users');
    res.json(users);
});

app.listen(3000, () => console.log('Backend live at http://localhost:3000'));