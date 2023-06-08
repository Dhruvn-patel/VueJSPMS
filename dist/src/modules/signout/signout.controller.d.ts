import { JwtService } from '@nestjs/jwt';
import { SignoutService } from './signout.service';
export declare class SignoutController {
    private readonly signoutService;
    private readonly jwtService;
    constructor(signoutService: SignoutService, jwtService: JwtService);
    signOut(req: any, res: any, session: Record<string, any>): void;
}
