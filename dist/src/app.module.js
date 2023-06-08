"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const signup_module_1 = require("./modules/signup/signup.module");
const prisma_service_1 = require("./prisma/prisma.service");
const signin_module_1 = require("./modules/signin/signin.module");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const signout_module_1 = require("./modules/signout/signout.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const home_module_1 = require("./modules/home/home.module");
const forgetemail_module_1 = require("./modules/forgetemail/forgetemail.module");
const mailer_1 = require("@nestjs-modules/mailer");
const products_module_1 = require("./modules/products/products.module");
const category_module_1 = require("./modules/category/category.module");
const cart_module_1 = require("./modules/cart/cart.module");
const google_strategy_1 = require("./strategies/google.strategy");
const user_module_1 = require("./modules/user/user.module");
const config_1 = require("@nestjs/config");
const mail_module_1 = require("./modules/mail/mail.module");
const jwt_1 = require("@nestjs/jwt");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            signup_module_1.SignupModule,
            signin_module_1.SigninModule,
            signout_module_1.SignoutModule,
            dashboard_module_1.DashboardModule,
            home_module_1.HomeModule,
            forgetemail_module_1.ForgetemailModule,
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            products_module_1.ProductsModule,
            category_module_1.CategoryModule,
            cart_module_1.CartModule,
            user_module_1.UserModule,
            mail_module_1.MailModule,
            mailer_1.MailerModule.forRoot({
                transport: {
                    host: 'smtp.gmail.com',
                    port: 25,
                    auth: {
                        user: 'esparkdhruv@gmail.com',
                        pass: 'bxsgfmgdormiyzqg',
                    },
                    tls: {},
                },
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            prisma_service_1.PrismaService,
            jwt_strategy_1.JwtStrategy,
            google_strategy_1.GoogleStrategy,
            jwt_1.JwtService,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map