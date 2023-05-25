const userService = require('../services/user-service')
const cartService = require('../services/cart-service')
const {validationResult} = require('express-validator')
const ApiError = require('../exceptions/api-error')

class UserController{
    async registration(req, res, next){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest("Validation error", errors.array()))
            }
            const {name, surname, email, password} = req.body;
            const userData = await userService.registration(email, password, name, surname);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 4*60*60*1000, httpOnly: true})
            return res.json(userData);
        }catch (e) {
            next(e);
        }
    }

    async login(req, res, next){
        try{
            const {email, password} = req.body;
            const userData = await userService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 4*60*60*1000, httpOnly: true})
            return res.json(userData);
        }catch (e) {
            next(e)
        }
    }

    async logout(req, res, next){
        try{
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken');
            return res.json(refreshToken)
        }catch (e) {
            next(e)
        }
    }

    async activateAccount(req, res, next){
        try{
            const activationLink = req.params.link
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        }catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next){
        try{
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 4*60*60*1000, httpOnly: true})
            return res.json(userData);
        }catch (e) {
            next(e)
        }
    }

    async getCart(req, res, next){
        try{
            const {userId} = req.body
            const cartItems = await cartService.getCartItems(userId)
            return res.json(cartItems)
        }catch (e) {
            next(e)
        }
    }

    async addToCart(req,res, next){
        try {
            const {userId, bookId} = req.body
            const cartData = await cartService.addBook(userId, bookId)
            return res.json(cartData)
        }catch (e) {
            next(e)
        }
    }

    async updateCartItem(req, res, next){
        try {
            const {userId, idx,qnt, key} = req.body
            const cartData = await cartService.updateCart(userId, idx, qnt, key)
            return res.json(cartData)
        }catch (e) {
            next(e)
        }
    }

}

module.exports = new UserController();