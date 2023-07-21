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
exports.SigninService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let SigninService = class SigninService {
    constructor(prismService, jwtService) {
        this.prismService = prismService;
        this.jwtService = jwtService;
    }
    async signIn(authsignindto, req, res) {
        const { email, password } = authsignindto;
        console.log(email, password);
        try {
            const user = await this.prismService.user.findUnique({
                where: {
                    email: email,
                },
            });
            if (user == null) {
                return new common_1.UnauthorizedException();
            }
            else {
                const hashedpassword = user.password;
                const ismatch = await bcrypt.compare(password, hashedpassword);
                console.log('matches', ismatch);
                if (ismatch == false) {
                    return new common_1.BadRequestException();
                }
                const token = await this.addToken({
                    name: user.name,
                    email: user.email,
                    roles: user.rolesId,
                    userId: Number(user.id),
                });
                return { token: token, roles: user.rolesId };
            }
        }
        catch (error) {
            console.log(error.message);
            return error;
        }
    }
    async addToken(args) {
        const payload = args;
        const token = await this.jwtService.signAsync(payload, {
            expiresIn: '2d',
            secret: process.env.JWT_SECRET_USER,
        });
        return token;
    }
    async googleLogin(req, res) {
        if (!req.user.email) {
            return 'No user from google';
        }
        const datainserted = await prisma.user.upsert({
            where: {
                email: req.user.email,
            },
            update: {},
            create: {
                name: req.user.firstName,
                email: req.user.email,
                password: '',
                googleId: req.user.id,
            },
        });
        const tokendata = await this.addToken({
            name: req.user.firstName,
            email: req.user.email,
            roles: 2,
            userId: Number(datainserted.id),
        });
        const token = {
            token: tokendata,
        };
        res.cookie('JWT_TOKEN', token, { httpOnly: true });
        return {
            message: 'User Info from Google',
            user: req.user,
            token: tokendata,
        };
    }
};
__decorate([
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SigninService.prototype, "googleLogin", null);
SigninService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], SigninService);
exports.SigninService = SigninService;
//# sourceMappingURL=signin.service.js.map