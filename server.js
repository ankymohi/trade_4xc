const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');

// Set EJS as the view engine
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));


// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define a route to render the index.ejs file
app.get('/', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});
app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});
app.get('/trade', (req, res) => {
    res.render('webtrader');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
