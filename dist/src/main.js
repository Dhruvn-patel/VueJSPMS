"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
const common_1 = require("@nestjs/common");
const cookieParser = require("cookie-parser");
const swagger_1 = require("@nestjs/swagger");
const session = require("express-session");
require('dotenv').config({ path: `../.env` });
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Product Management')
        .setDescription('This documentation contains all the information about product management Api')
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    app.useStaticAssets((0, path_1.join)(__dirname, '../../', 'public'));
    app.setBaseViewsDir((0, path_1.join)(__dirname, '../../', 'views'));
    app.enableCors({ credentials: true, origin: true });
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: false,
        cookie: {
            maxAge: 500000,
        },
    }));
    app.useBodyParser('json', { limit: '200mb' });
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.use(cookieParser());
    app.setViewEngine('ejs');
    await app.listen(3030);
}
bootstrap();
//# sourceMappingURL=main.js.map