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
exports.SignoutController = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const signout_service_1 = require("./signout.service");
let SignoutController = class SignoutController {
    constructor(signoutService, jwtService) {
        this.signoutService = signoutService;
        this.jwtService = jwtService;
    }
    signOut(req, res, session) {
        console.log('sdfssdfs', req.session.roles);
        req.session.destroy((err) => {
            console.log('session is destoryed');
        });
        res.clearCookie('JWT_TOKEN');
        res.redirect('/signin');
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)({ passthrough: true })),
    __param(2, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], SignoutController.prototype, "signOut", null);
SignoutController = __decorate([
    (0, common_1.Controller)('signout'),
    __metadata("design:paramtypes", [signout_service_1.SignoutService,
        jwt_1.JwtService])
], SignoutController);
exports.SignoutController = SignoutController;
//# sourceMappingURL=signout.controller.js.map