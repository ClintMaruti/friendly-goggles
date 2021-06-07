/**
 * Module dependencies
 */
const books = require('./booksdb');

class booksRoutes {
    static getBooks (req, res) {
        res.status(200).json(books);
    }

    static postBooks (req, res) {
        const { role } = req.user;
    
        if(role !== 'admin'){
            return res.sendStatus(403)
        }
    
        const book = req.body;
        books.push(book);
    
        res.json({message: 'Book added successfully'});
    }
}

module.exports = booksRoutes;
