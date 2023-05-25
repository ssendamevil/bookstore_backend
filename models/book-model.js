const {Schema, model} = require('mongoose');

const BookSchema = new Schema({
    name:{type: String},
    image: [{type: String}],
    author:[
        {
            name: {type: String},
            info: {type: String}
        }
    ],
    format:{
        hardcover:{type:Boolean},
        audiobook:{type:Boolean},
        nook_book:{type:Boolean}
    },
    price:{
        hardcover:{type: String},
        audiobook:{type:String},
        ebook:{type:String},
        paperback:{type: String}
    },
    description: {type:String},
    details:{
        ISBN:{type:String},
        publisher: {type:String},
        publication_date: {type:String},
        edition:{type:String},
        pages:{type:String},
        sales_rank:	{type:String},
        product_dimensions:	{
            w: {type:String},
            h: {type:String},
            d: {type:String},
        },
        lexile:{type:String},
        age_range:{type:String}
    },
    category:[{type:String}],
    subject:[{type:String}],
    special_shelf:[{type:String}],
})

module.exports = model('books',BookSchema)