const bookService = require('../services/book-service');

class BookController {
    async getAllBooks(req, res, next){
        try {
            const books = await bookService.getAllBooks();
            return res.json(books);
        }catch (e) {
            next(e)
        }
    }
    
    async getBookById(req, res, next){
        try {
            const id = req.params.id
            const book = await bookService.getBookById(id);
            return res.json(book)
        }catch (e) {
            next(e)
        }
    }
}

module.exports = new BookController();