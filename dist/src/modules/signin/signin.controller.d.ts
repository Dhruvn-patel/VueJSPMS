import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto } from './dto/authlogin.dto';
import { SigninService } from './signin.service';
import { Request } from 'express';
export declare class SigninController {
    private readonly signinService;
    private readonly jwtService;
    constructor(signinService: SigninService, jwtService: JwtService);
    showLogin(req: any, res: any): Promise<void>;
    signIn(authsignin: AuthLoginDto, req: Request, res: any, session: Record<string, any>): Promise<any>;
    googleAuth(req: any, res: any): Promise<any>;
    googleAuthRedirect(req: any, res: any): Promise<any>;
}
