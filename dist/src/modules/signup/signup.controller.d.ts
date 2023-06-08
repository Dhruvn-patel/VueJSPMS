import { AuthSignUpDto } from './dto/authsignup.dto';
import { SignupService } from './signup.service';
import { JwtService } from '@nestjs/jwt';
export declare class SignupController {
    private readonly signupService;
    private readonly jwtService;
    constructor(signupService: SignupService, jwtService: JwtService);
    root(req: any, res: any): Promise<void>;
    signUp(authsignup: AuthSignUpDto, req: any, res: any): Promise<any>;
}
