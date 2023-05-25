const cartModel = require('../models/cart-model')
const bookModel = require('../models/book-model')
const {ObjectId} = require("mongodb");

class CartService {
    async saveCart(userId, bookId){
        const cart = await cartModel.create({user: userId})
        return cart
    }

    async addBook(userId, bookId){
        const uId = new ObjectId(userId)
        const bId = new ObjectId(bookId)
        const currentCart = await cartModel.findOne({user: uId})
        if(currentCart) {
            var i = null;
            var j = 0;
            currentCart.books.forEach((b)=>{
                if (b.book.equals(bId)) {
                    return i = j;
                }
                j++;
            });

            if(i !== null){
                currentCart.books[i].quantity = currentCart.books[i].quantity + 1;
                return currentCart.save();
            }else{
                await cartModel.updateOne({_id: currentCart._id}, {$push: {books:{book: bId, quantity: 1}}})
            }
        }
    }

    async getCartItems(userId){
        const uId = new ObjectId(userId)
        const cart = await cartModel.findOne({user: uId}).populate('books')
        let cartBooks = [];
        if(cart){
            for(let i = 0;i< cart.books.length; i++){
                let book = await bookModel.findById(cart.books[i].book);
                let item = {book: book, quantity: cart.books[i].quantity}
                cartBooks[i] = item;
            }
        }
        return cartBooks;
    }

    async updateCart(userId, idx, qnt, key){
        const uId = new ObjectId(userId)
        const cartItem = await cartModel.findOne({user: uId})
        if(key === 'upd'){
            cartItem.books[idx].quantity = qnt
            cartItem.save()
            return cartItem
        }else if(key === 'rmv'){
            await cartModel.updateMany({_id: cartItem._id}, {$pull: {books: {book: cartItem.books[idx].book}}})
            const item = await cartModel.findOne({user: uId})
            return item
        }
    }
}

module.exports = new CartService();