import { AppService } from './app.service';
import { JwtService } from '@nestjs/jwt';
export declare class AppController {
    private readonly appService;
    private readonly jwtService;
    constructor(appService: AppService, jwtService: JwtService);
    getHello(req: any, res: any): Promise<string>;
    notFound(req: any, res: any): Promise<any>;
}
