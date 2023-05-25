const bookModel = require('../models/book-model');

class BookService {
    async getAllBooks(){
        const books = await bookModel.find();
        return books
    }

    async getBookById(id){
        const book = await bookModel.findById(id);
        return book
    }
}

module.exports = new BookService();