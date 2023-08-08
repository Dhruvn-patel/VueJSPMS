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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgetemailService = void 0;
const bcrypt = require("bcrypt");
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let ForgetemailService = class ForgetemailService {
    constructor(configService, mailerService) {
        this.configService = configService;
        this.mailerService = mailerService;
    }
    async sendMaildata(email) {
        const Email = email.email;
        const Name = email.email;
        const token = generateOTP();
        try {
            await this.mailerService.sendMail({
                to: `${Email}`,
                from: 'esparkdhruv@gmail.com',
                subject: 'Forgot Password Change',
                text: 'OTP for Reset Password',
                html: `<b> ${token} <b>`,
            });
        }
        catch (error) {
            console.log(error);
        }
        console.log('token', token, Email);
        return { token, Email };
    }
    async checkOtp(Opt, userEnterOtp) {
        try {
            console.log('fhisude', Opt, Number(userEnterOtp.OTP));
            if (Opt == Number(userEnterOtp.OTP)) {
                return {
                    status: 200,
                };
            }
            return new common_1.BadRequestException();
        }
        catch (error) {
            return new common_1.BadRequestException();
        }
    }
    async forgotPassword(data) {
        const email = data.email;
        const userEmail = await prisma.user.findUnique({
            where: {
                email: email,
            },
            select: {
                email: true,
            },
        });
        if (!userEmail) {
            return new common_1.BadRequestException();
        }
        else {
            return userEmail;
        }
    }
    async ChangePassword(Data, email) {
        try {
            const hashedpassword = await bcrypt.hash(Data.password, 10);
            const ChangedPassword = await prisma.user.update({
                data: {
                    password: hashedpassword,
                },
                where: {
                    email: email,
                },
            });
            return ChangedPassword;
        }
        catch (error) {
            return new common_1.BadRequestException();
        }
    }
};
ForgetemailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        mailer_1.MailerService])
], ForgetemailService);
exports.ForgetemailService = ForgetemailService;
function generateOTP() {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}
//# sourceMappingURL=forgetemail.service.js.map