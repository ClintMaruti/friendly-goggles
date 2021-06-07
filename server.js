/**
 * Module dependencies.
 */
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');

const authRoutes = require('./auth');
const booksRoutes = require('./books');

const authenticateJwt = require('./authMiddleware');

const app = express();

// middleware
app.use(bodyParser.json());

// auth
app.post('/login', authRoutes.login);
app.post('/token', authRoutes.token);
app.post('/logout', authRoutes.logout);

// books
app.post('/books', authenticateJwt, booksRoutes.postBooks);
app.get('/books', authenticateJwt, booksRoutes.getBooks);

const port = 3000
module.exports = app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})
