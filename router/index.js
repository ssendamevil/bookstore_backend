const Router = require('express').Router;
const userController = require('../controllers/user-controller')
const bookController = require('../controllers/book-controller')
const router = new Router();
const {body} = require('express-validator')
const authMiddleware = require('../middlewares/auth-middleware')

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min:8, max: 32}),
    userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/addBook', userController.addToCart);
router.post('/getCartItems', userController.getCart);
router.post('/updateCart', userController.updateCartItem);
router.get('/activate/:link', userController.activateAccount);
router.get('/refresh', userController.refresh);
router.get('/books', bookController.getAllBooks);
router.get('/book/:id', bookController.getBookById);

module.exports = router