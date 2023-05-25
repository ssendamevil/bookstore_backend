const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('../services/mail-service')
const tokenService = require('../services/token-service')
const cartService = require('../services/cart-service')
const ApiError = require('../exceptions/api-error')
const userDto = require('../dtos/user-dto')


class UserService{
    async registration(email, password, name, surname){
        const candidate = await UserModel.findOne({email})
        if(candidate){
            throw ApiError.BadRequest(`User with email ${email} already exists!`);
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        const user = await UserModel.create({email, password: hashPassword,name, surname, activationLink})
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
        const userdto = new userDto(user)
        const tokens = tokenService.generateTokens({...userdto})
        await cartService.saveCart(userdto.id, "")
        await tokenService.saveToken(userdto.id, tokens.refreshToken);

        return{...tokens, user: userdto}
    }

    async activate(activationLink){
        const user = await UserModel.findOne({activationLink})
        if(!user){
            throw ApiError.BadRequest('Incorrect activation link');
        }
        user.isActivated = true;
        await user.save()
    }

    async login(email, password){
        const user = await UserModel.findOne({email});
        if(!user){
            throw ApiError.BadRequest(`User with email ${email} does not found!`);
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if(!isPassEquals){
            throw ApiError.BadRequest("Incorrect password");
        }
        const userdto = new userDto(user)
        const tokens = tokenService.generateTokens({...userdto})
        await tokenService.saveToken(userdto.id, tokens.refreshToken);
        return{...tokens, user: userdto}
    }

    async logout (refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken){
        if(!refreshToken){
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefresh(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDb){
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findOne({_id: userData.id})
        const userdto = new userDto(user)
        const tokens = tokenService.generateTokens({...userdto})
        await tokenService.saveToken(userdto.id, tokens.refreshToken);
        return{...tokens, user: userdto}
    }

}

module.exports = new UserService()