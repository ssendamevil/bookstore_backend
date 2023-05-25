const {Schema, model} = require('mongoose')

const CartSchema = new Schema({
    user: {type:Schema.Types.ObjectId, ref:'User'},
    books: [{
        book:{type:Schema.Types.ObjectId, ref: 'books'},
        quantity: {type: Number}
    }]
})

module.exports = model('Cart', CartSchema)