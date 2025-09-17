const express = require('express');
const path = require('path');

const app = express();

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Set the folder for static files like CSS
app.use(express.static(path.join(__dirname, 'public')));

// Route to render the index page
app.get('/', (req, res) => {
    res.render('index', { title: 'Hello World from EJS!' });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});