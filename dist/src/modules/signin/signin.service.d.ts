import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthLoginDto } from './dto/authlogin.dto';
import { Response } from 'express';
export declare class SigninService {
    private prismService;
    private jwtService;
    constructor(prismService: PrismaService, jwtService: JwtService);
    signIn(authsignindto: AuthLoginDto, req: any, res: Response): Promise<any>;
    addToken(args: {
        name: string;
        email: string;
        roles: number;
        userId: number;
    }): Promise<string>;
    googleLogin(req: any, res: any): Promise<"No user from google" | {
        message: string;
        user: any;
        token: string;
    }>;
}
