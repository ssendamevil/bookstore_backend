const ApiError = require('../exceptions/api-error');
const tokenService = require('../services/token-service');

module.exports = function (req, res, next) {
    try{
        // const authHeader = req.headers.authorization;
        //
        // if (!authHeader){
        //     return next(ApiError.UnauthorizedError());
        // }
        //
        // const accessToken = authHeader.split(' ')[1]
        // if(!accessToken){
        //     return next(ApiError.UnauthorizedError());
        // }
        //
        // const userData = tokenService.validateAccess(accessToken)
        // if(!userData){
        //     return next(ApiError.UnauthorizedError());
        // }
        // req.body.userId = userData.id
        // req.body.email = userData.email
        // req.body.name = userData.name
        // req.body.surname = userData.surname
        if(req.session.isAuth){
            next()
        }else{
            return next(ApiError.UnauthorizedError());
        }
    } catch(e){
        return next(ApiError.UnauthorizedError());
    }
}