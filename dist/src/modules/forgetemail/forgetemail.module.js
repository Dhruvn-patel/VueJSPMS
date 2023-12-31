"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgetemailModule = void 0;
const common_1 = require("@nestjs/common");
const forgetemail_service_1 = require("./forgetemail.service");
const forgetemail_controller_1 = require("./forgetemail.controller");
const jwt_1 = require("@nestjs/jwt");
const mailer_1 = require("@nestjs-modules/mailer");
const mail_service_1 = require("../mail/mail.service");
let ForgetemailModule = class ForgetemailModule {
};
ForgetemailModule = __decorate([
    (0, common_1.Module)({
        imports: [mailer_1.MailerModule],
        controllers: [forgetemail_controller_1.ForgetemailController],
        providers: [forgetemail_service_1.ForgetemailService, jwt_1.JwtService, mail_service_1.MailService],
    })
], ForgetemailModule);
exports.ForgetemailModule = ForgetemailModule;
//# sourceMappingURL=forgetemail.module.js.map