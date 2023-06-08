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
exports.SignupController = void 0;
const common_1 = require("@nestjs/common");
const authsignup_dto_1 = require("./dto/authsignup.dto");
const signup_service_1 = require("./signup.service");
const jwt_1 = require("@nestjs/jwt");
let SignupController = class SignupController {
    constructor(signupService, jwtService) {
        this.signupService = signupService;
        this.jwtService = jwtService;
    }
    async root(req, res) {
        const isCheck = req.cookies['JWT_TOKEN'] == null;
        if (isCheck) {
            res.render('signup');
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
        return;
    }
    async signUp(authsignup, req, res) {
        try {
            const resdata = await this.signupService.signUp(authsignup, authsignup.googleId);
            console.log('resdata', resdata);
            if (resdata.errorCode == 409) {
                return res.status(409).json({
                    errmsg: 'Email is already registered',
                    data: null,
                    status: 409,
                });
            }
            else if (resdata.errorCode === 200) {
                return res.status(200).json({
                    errmsg: '',
                    data: resdata,
                    status: 200,
                });
            }
        }
        catch (error) {
            console.log(error.message);
            return error;
        }
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, common_1.Render)('signup'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SignupController.prototype, "root", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [authsignup_dto_1.AuthSignUpDto, Object, Object]),
    __metadata("design:returntype", Promise)
], SignupController.prototype, "signUp", null);
SignupController = __decorate([
    (0, common_1.Controller)('signup'),
    __metadata("design:paramtypes", [signup_service_1.SignupService,
        jwt_1.JwtService])
], SignupController);
exports.SignupController = SignupController;
//# sourceMappingURL=signup.controller.js.map