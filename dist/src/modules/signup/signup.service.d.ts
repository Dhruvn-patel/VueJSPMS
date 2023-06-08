import { PrismaService } from '../../prisma/prisma.service';
import { AuthSignUpDto } from './dto/authsignup.dto';
export declare class SignupService {
    private prismService;
    constructor(prismService: PrismaService);
    signUp(authsignupdto: AuthSignUpDto, googleId: string): Promise<any>;
}
