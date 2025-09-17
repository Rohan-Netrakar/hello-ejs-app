const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// PostgreSQL connection setup using environment variables
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

// Check DB connection at startup
pool.connect()
    .then(client => {
        console.log('Connected to PostgreSQL database.');
        client.release(); // release the client back to the pool
    })
    .catch(err => {
        console.error('Error connecting to PostgreSQL', err);
        process.exit(1); // stop the app if DB connection fails
    });


// Set EJS as templating engine
app.set('view engine', 'ejs');

// Set static files folder
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));

// GET route to render the form and list of names
app.get('/', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users");
        res.render('index', { title: 'Hello World from EJS!', users: result.rows });
    } catch (err) {
        console.error('Database error', err);
        res.send("Error loading names");
    }
});

// POST route to handle form submission
app.post('/add', async (req, res) => {
    const name = req.body.name;
    if (name && name.trim() !== '') {
        try {
            await pool.query("INSERT INTO users (name) VALUES ($1)", [name.trim()]);
            res.redirect('/');
        } catch (err) {
            console.error('Database error', err);
            res.send("Error saving name");
        }
    } else {
        res.redirect('/');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
