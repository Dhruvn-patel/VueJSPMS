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
exports.ForgetemailController = void 0;
const common_1 = require("@nestjs/common");
const forgetemail_service_1 = require("./forgetemail.service");
const jwt_1 = require("@nestjs/jwt");
const mailer_1 = require("@nestjs-modules/mailer");
let ForgetemailController = class ForgetemailController {
    constructor(forgetemailService, jwtService, mailerService) {
        this.forgetemailService = forgetemailService;
        this.jwtService = jwtService;
        this.mailerService = mailerService;
    }
    getForgotPassword(req, res) {
        res.render('forgetpassword');
    }
    getchangePassword(req, res) {
        res.render('passwordchange');
    }
    roota(req, res) {
        return;
    }
    async getAddCategory(req, res, Dto, session) {
        const result = await this.forgetemailService.forgotPassword(Dto);
        if (result.status == 400) {
            return res.status(400).json({
                status: 400,
                data: result,
                message: `Invalid email address`,
            });
        }
        else {
            const SendEmailandThrowOpt = await this.forgetemailService.sendMaildata(Dto);
            console.log('SendEmailandThrowOpt', SendEmailandThrowOpt);
            req.session.data = SendEmailandThrowOpt.token;
            req.session.email = SendEmailandThrowOpt.Email;
            return res.status(200).json({
                status: 200,
                data: result,
                message: `Enter OTP`,
                otp: SendEmailandThrowOpt.token,
            });
        }
    }
    async getChangePassword(req, res, Data, session) {
        const Opt = req.session.data;
        const email = req.session.email;
        const otpIsValid = req.session.otpIsValid;
        if (email) {
            const result = await this.forgetemailService.ChangePassword(Data, email);
            console.log('result', result);
            if (result.status == 400) {
                return res.status(400).json({
                    status: 400,
                    data: '',
                });
            }
            else {
                req.session.destroy();
                return res.status(200).json({
                    status: 200,
                    data: result,
                });
            }
        }
    }
    async getcheckOtp(req, res, Dto, userEnterOtp, session) {
        console.log(userEnterOtp);
        const Opt = req.session.data;
        if (Opt) {
            const result = await this.forgetemailService.checkOtp(Opt, userEnterOtp);
            if (result.status == 200) {
                req.session.otpIsValid = true;
                return res.status(200).json({
                    status: 200,
                    data: result,
                });
            }
            else {
                return res.status(400).json({
                    status: 400,
                    data: '',
                });
            }
        }
    }
};
__decorate([
    (0, common_1.Get)('forgot-password'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ForgetemailController.prototype, "getForgotPassword", null);
__decorate([
    (0, common_1.Get)('changepassword'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ForgetemailController.prototype, "getchangePassword", null);
__decorate([
    (0, common_1.Get)('otp'),
    (0, common_1.Render)('otp'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ForgetemailController.prototype, "roota", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, Object]),
    __metadata("design:returntype", Promise)
], ForgetemailController.prototype, "getAddCategory", null);
__decorate([
    (0, common_1.Post)('changePassword'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, Object]),
    __metadata("design:returntype", Promise)
], ForgetemailController.prototype, "getChangePassword", null);
__decorate([
    (0, common_1.Post)('otp'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Body)()),
    __param(4, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], ForgetemailController.prototype, "getcheckOtp", null);
ForgetemailController = __decorate([
    (0, common_1.Controller)('forgetemail'),
    __metadata("design:paramtypes", [forgetemail_service_1.ForgetemailService,
        jwt_1.JwtService,
        mailer_1.MailerService])
], ForgetemailController);
exports.ForgetemailController = ForgetemailController;
//# sourceMappingURL=forgetemail.controller.js.map