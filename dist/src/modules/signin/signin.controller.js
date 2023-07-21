"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SigninController = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const authlogin_dto_1 = require("./dto/authlogin.dto");
const signin_service_1 = require("./signin.service");
const passport_1 = require("@nestjs/passport");
let SigninController = class SigninController {
    constructor(signinService, jwtService) {
        this.signinService = signinService;
        this.jwtService = jwtService;
    }
    async showLogin(req, res) {
        const isCheck = req.cookies['JWT_TOKEN'] == null;
        if (isCheck) {
            res.render('signin');
        }
        else {
            const { token } = req.cookies['JWT_TOKEN'];
            const dataget = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET_USER,
            });
            const { email, name, userId, roles } = dataget;
            console.log('roles', roles);
            if (roles == 2)
                res.redirect('/home');
            else
                res.redirect('/dashboard');
        }
    }
    async signIn(authsignin, req, res, session) {
        try {
            const responseToken = await this.signinService.signIn(authsignin, req, res);
            console.log('response service', responseToken);
            if (responseToken.status == 401) {
                console.log('401');
                try {
                    res.status(401).json({
                        errmsg: 'email is not registered',
                        data: null,
                        status: 401,
                    });
                }
                catch (error) {
                    return error;
                }
            }
            else if (responseToken.status == 400) {
                console.log('400');
                try {
                    res.status(400).json({
                        errmsg: 'password is not correct',
                        data: null,
                        status: 400,
                    });
                }
                catch (error) {
                    return error;
                }
            }
            else {
                res.cookie('JWT_TOKEN', responseToken, { httpOnly: true });
                session.roles = responseToken.roles;
                res.status(200).json({
                    errmsg: 'Successfully login',
                    data: responseToken.token,
                    roles: responseToken.roles,
                    status: 200,
                });
            }
        }
        catch (error) {
            console.log(error.message);
        }
    }
    async googleAuth(req) { }
    async googleAuthRedirect(req, res) {
        const googleres = await this.signinService.googleLogin(req, res);
        console.log(googleres);
        return res.redirect('/home');
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SigninController.prototype, "showLogin", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Post)('/insert'),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __param(3, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [authlogin_dto_1.AuthLoginDto, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SigninController.prototype, "signIn", null);
__decorate([
    (0, common_1.Get)('google'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SigninController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('redirect'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SigninController.prototype, "googleAuthRedirect", null);
SigninController = __decorate([
    (0, common_1.Controller)('signin'),
    __metadata("design:paramtypes", [signin_service_1.SigninService,
        jwt_1.JwtService])
], SigninController);
exports.SigninController = SigninController;
//# sourceMappingURL=signin.controller.js.map