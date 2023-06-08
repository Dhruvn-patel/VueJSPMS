"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignoutModule = void 0;
const common_1 = require("@nestjs/common");
const signout_service_1 = require("./signout.service");
const signout_controller_1 = require("./signout.controller");
const jwt_1 = require("@nestjs/jwt");
let SignoutModule = class SignoutModule {
};
SignoutModule = __decorate([
    (0, common_1.Module)({
        controllers: [signout_controller_1.SignoutController],
        providers: [signout_service_1.SignoutService],
        imports: [jwt_1.JwtModule]
    })
], SignoutModule);
exports.SignoutModule = SignoutModule;
//# sourceMappingURL=signout.module.js.map