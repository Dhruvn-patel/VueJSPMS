import { PrismaService } from '../../prisma/prisma.service';
import { UserDto } from './dto/user.dto';
export declare class DashboardService {
    private prismService;
    constructor(prismService: PrismaService);
    deleteUser(userId: number): Promise<import(".prisma/client").User>;
    updateUser(user: UserDto, userId: any, req: Request, res: Response): Promise<any>;
}
