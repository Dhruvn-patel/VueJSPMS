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
exports.SignupService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
let SignupService = class SignupService {
    constructor(prismService) {
        this.prismService = prismService;
    }
    async signUp(authsignupdto, googleId) {
        const { name, email, password } = authsignupdto;
        const hashpassword = await bcrypt.hash(password, 10);
        try {
            const emailExists = await this.prismService.user.findFirst({
                where: { email: email },
            });
            console.log('emailExists', emailExists);
            if (!emailExists) {
                const createUser = await this.prismService.user.create({
                    data: {
                        email: email,
                        googleId: googleId,
                        name: name,
                        password: hashpassword,
                    },
                });
                return {
                    errorCode: 200,
                    createUser,
                };
            }
            else {
                return {
                    errorCode: 409,
                };
            }
        }
        catch (error) {
            console.log(error.message);
            return error;
        }
    }
};
SignupService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SignupService);
exports.SignupService = SignupService;
//# sourceMappingURL=signup.service.js.map