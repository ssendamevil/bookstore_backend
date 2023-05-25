require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoDbSession = require('connect-mongodb-session')(session)
const mongoose = require('mongoose')
const router = require('./router/index')
const errorMiddleware = require('./middlewares/error-middleware')

const PORT = process.env.PORT || 5000;
const app = express()

const store = new MongoDbSession({
    uri: process.env.DB_URL,
    collection: 'sessions'
})

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use(cookieParser());
app.use(session({
    secret: 'bookstore',
    resave: false,
    saveUninitialized: false,
    store: store
}))
app.use('/api', router);
app.use(errorMiddleware);


const start = async () => {
    try{
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        // mongoose.set('strictQuery', true)
        app.listen(PORT, ()=> console.log(`Server started on PORT = ${PORT}`))
    }catch (e) {
        console.log(e)
    }
}

start()